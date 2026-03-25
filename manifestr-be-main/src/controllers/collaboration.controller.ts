/**
 * Collaboration Controller
 * 
 * Handles document collaboration features:
 * - Inviting users
 * - Managing access
 * - Tracking sessions
 * 
 * SAFE: This is a NEW file, doesn't modify existing controllers
 */

import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { supabaseAdmin } from '../lib/supabase';
import { authenticateToken } from '../middleware/auth.middleware';
import crypto from 'crypto';

export class CollaborationController extends BaseController {
    public basePath = '/collaborations';

    constructor() {
        super();
    }

    protected initializeRoutes(): void {
        this.routes = [
            {
                verb: 'POST',
                path: '/invite',
                middlewares: [authenticateToken],
                handler: this.inviteUser.bind(this),
            },
            {
                verb: 'GET',
                path: '/:documentId/collaborators',
                middlewares: [authenticateToken],
                handler: this.getCollaborators.bind(this),
            },
            {
                verb: 'DELETE',
                path: '/:documentId/user/:userId',
                middlewares: [authenticateToken],
                handler: this.removeCollaborator.bind(this),
            },
            {
                verb: 'POST',
                path: '/accept/:token',
                middlewares: [authenticateToken],
                handler: this.acceptInvite.bind(this),
            },
            {
                verb: 'POST',
                path: '/session/start',
                middlewares: [authenticateToken],
                handler: this.startSession.bind(this),
            },
            {
                verb: 'POST',
                path: '/session/end',
                middlewares: [authenticateToken],
                handler: this.endSession.bind(this),
            },
            {
                verb: 'GET',
                path: '/:documentId/active-users',
                middlewares: [authenticateToken],
                handler: this.getActiveUsers.bind(this),
            },
        ];
    }

    /**
     * Invite a user to collaborate on a document
     */
    private async inviteUser(req: Request, res: Response) {
        try {
            const { documentId, email, role, message } = req.body;
            const inviterId = (req as any).user?.userId;

            if (!documentId || !email || !role) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            // Check if inviter is the owner
            const { data: ownership, error: ownerError } = await supabaseAdmin
                .from('document_collaborators')
                .select('role')
                .eq('document_id', documentId)
                .eq('user_id', inviterId)
                .eq('role', 'owner')
                .single();

            if (ownerError || !ownership) {
                return res.status(403).json({ error: 'Only document owners can invite collaborators' });
            }

            // Check collaborator limit (max 5 total)
            const { count } = await supabaseAdmin
                .from('document_collaborators')
                .select('*', { count: 'exact', head: true })
                .eq('document_id', documentId)
                .in('status', ['accepted', 'pending']);

            if ((count || 0) >= 5) {
                return res.status(400).json({ error: 'Maximum of 5 collaborators reached (1 owner + 4 invited)' });
            }

            // STEP 1: Check if invitee email already has access (registered user)
            let { data: existingUser } = await supabaseAdmin
                .from('users')
                .select('id')
                .eq('email', email.toLowerCase().trim())
                .single();

            let inviteeUserId = existingUser?.id || null;

            // STEP 1.5: If user doesn't exist, CREATE THEM (for testing/quick collaboration)
            if (!inviteeUserId) {
                console.log(` User ${email} doesn't exist. Creating placeholder account...`);
                
                try {
                    // Create user in Supabase Auth first
                    const emailPrefix = email.split('@')[0];
                    const defaultPassword = 'Manifestr123!'; // Default password for invited users
                    
                    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
                        email: email.toLowerCase().trim(),
                        password: defaultPassword, // Set default password
                        email_confirm: true, // Auto-confirm email
                        user_metadata: {
                            first_name: emailPrefix,
                            last_name: 'Invited User',
                            invited_user: true // Mark as invited user
                        }
                    });

                    if (authError) {
                        console.error(' Failed to create auth user:', authError);
                        throw authError;
                    }

                    inviteeUserId = authUser.user.id;
                    console.log(`✅ Auth user created: ${inviteeUserId}`);

                    // ALWAYS create in users table (ignore duplicates)
                    console.log(`📝 Creating user record in users table...`);
                    const { error: userInsertError } = await supabaseAdmin
                        .from('users')
                        .insert({
                            id: inviteeUserId,
                            email: email.toLowerCase().trim(),
                            first_name: emailPrefix, // Using emailPrefix from line 123
                            last_name: 'Invited User',
                            email_verified: true,
                            onboarding_completed: false,
                            promotional_emails: false,
                            tier: 'free',
                            wins_balance: 100,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString()
                        });
                    
                    if (userInsertError) {
                        if (userInsertError.code === '23505') {
                            console.log(` User already exists in users table (duplicate, OK)`);
                        } else {
                            console.error(` Failed to create in users table:`, userInsertError);
                            throw userInsertError;
                        }
                    } else {
                        console.log(` User created in users table`);
                    }
                    
                    // Verify it worked
                    const { data: verifyUser } = await supabaseAdmin
                        .from('users')
                        .select('id, email')
                        .eq('id', inviteeUserId)
                        .single();
                    
                    if (!verifyUser) {
                        throw new Error('User was not created in users table despite successful insert');
                    }
                    
                    console.log(` Verified user exists:`, verifyUser);
                    
                } catch (createError: any) {
                    console.error(' Failed to create user:', createError);
                    return res.status(500).json({ 
                        error: 'Could not create user account. They need to sign up first.',
                        details: createError.message 
                    });
                }
            }

            console.log(`Invitee user ID: ${inviteeUserId}`);

            // If user exists, check if they already have access
            if (inviteeUserId) {
                const { data: existingAccess } = await supabaseAdmin
                    .from('document_collaborators')
                    .select('id, role, status')
                    .eq('document_id', documentId)
                    .eq('user_id', inviteeUserId)
                    .single();

                if (existingAccess) {
                    if (existingAccess.status === 'accepted') {
                        return res.status(400).json({ 
                            error: `This user already has access as ${existingAccess.role}` 
                        });
                    } else if (existingAccess.status === 'pending') {
                        return res.status(400).json({ 
                            error: 'This user already has a pending invitation' 
                        });
                    }
                }
            }

            // STEP 2: Check if there's already a pending invite for this email
            const { data: existingInvite } = await supabaseAdmin
                .from('collaboration_invites')
                .select('id, status, expires_at')
                .eq('document_id', documentId)
                .eq('invitee_email', email.toLowerCase().trim())
                .in('status', ['pending'])
                .single();

            if (existingInvite) {
                const isExpired = new Date(existingInvite.expires_at) < new Date();
                if (!isExpired) {
                    return res.status(400).json({ 
                        error: 'An invitation has already been sent to this email address' 
                    });
                }
                // If expired, we'll create a new one (fall through)
            }

            // STEP 3: Add user DIRECTLY to document_collaborators (auto-accepted)
            console.log(` Adding ${email} directly as ${role} (auto-accepted)`);
            
            const { error: collabError } = await supabaseAdmin
                .from('document_collaborators')
                .insert({
                    document_id: documentId,
                    user_id: inviteeUserId,
                    role: role,
                    status: 'accepted', // Auto-accept!
                    invited_by: inviterId,
                    invited_at: new Date().toISOString(),
                    accepted_at: new Date().toISOString()
                });

            if (collabError) {
                console.error('❌ Failed to add collaborator:', collabError);
                if (collabError.code === '23505') {
                    return res.status(400).json({ error: 'This user already has access' });
                }
                return res.status(500).json({ error: 'Failed to add collaborator', details: collabError.message });
            }

            console.log(`✅ User ${email} added as ${role} to document (auto-accepted)`);

            // Generate unique invite token (for tracking)
            const inviteToken = crypto.randomBytes(32).toString('hex');

            // STEP 5: Create invite record (for audit trail) - mark as accepted
            const { data: invite, error: inviteError } = await supabaseAdmin
                .from('collaboration_invites')
                .insert({
                    document_id: documentId,
                    invited_by: inviterId,
                    invitee_email: email.toLowerCase().trim(),
                    invitee_user_id: inviteeUserId,
                    role: role,
                    invite_token: inviteToken,
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    message: message || null,
                    status: 'accepted', // Auto-accepted (no email process)
                    accepted_at: new Date().toISOString()
                })
                .select()
                .single();

            // Invite record creation is optional (just for audit trail)
            if (inviteError) {
                console.log('⚠️ Invite record not created (not critical):', inviteError.message);
            }

            // TODO: Send email notification here (when email service is integrated)
            console.log(`📧 Email notification would be sent to ${email} (email service not configured yet)`);

            // Get inviter name for logging
            const { data: inviter } = await supabaseAdmin
                .from('users')
                .select('first_name, last_name, email')
                .eq('id', inviterId)
                .single();
            const inviterName = inviter ? `${inviter.first_name} ${inviter.last_name}`.trim() || inviter.email : 'Someone';

            console.log(`✅ ${inviterName} added ${email} to collaborate as ${role}`);
            
            // If we created the user, include password info
            const responseMessage = !existingUser
                ? `✅ ${email} added as ${role}! Account created with password: Manifestr123!`
                : `✅ ${email} added as ${role}! They can now access the document.`;

            return res.json({
                status: 'success',
                message: responseMessage,
                data: {
                    userId: inviteeUserId,
                    email: email,
                    role: role,
                    status: 'accepted',
                    userCreated: !existingUser, // True if we created the account
                    defaultPassword: !existingUser ? 'Manifestr123!' : undefined, // Show password if created
                    inviteId: invite?.id
                }
            });

        } catch (error: any) {
            console.error('❌ Invite error:', error);
            return res.status(500).json({ error: 'Internal server error', details: error.message });
        }
    }

    /**
     * Get all collaborators for a document
     */
    private async getCollaborators(req: Request, res: Response) {
        try {
            const { documentId } = req.params;
            const userId = (req as any).user?.userId;

            console.log('📊 Get collaborators request:', { documentId, userId });

            // If no userId, check if document is owned by requesting user via generation_jobs
            if (!userId) {
                console.log('⚠️ No userId in request, checking document ownership via generation_jobs');
                
                // Fallback: Check if document exists and get owner
                const { data: job } = await supabaseAdmin
                    .from('generation_jobs')
                    .select('user_id')
                    .eq('id', documentId)
                    .single();
                
                if (!job) {
                    return res.status(404).json({ error: 'Document not found' });
                }
                
                // Return minimal data for non-authenticated requests
                const { data: collaborators, error } = await supabaseAdmin
                    .from('document_collaborators')
                    .select(`
                        id,
                        role,
                        status,
                        invited_at,
                        accepted_at,
                        user_id,
                        users (
                            id,
                            email,
                            full_name
                        )
                    `)
                    .eq('document_id', documentId);

                return res.json({
                    status: 'success',
                    data: collaborators || []
                });
            }

            // Check if user has access to this document
            const { data: access, error: accessError } = await supabaseAdmin
                .from('document_collaborators')
                .select('role')
                .eq('document_id', documentId)
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .single();

            console.log('🔐 Access check:', { access, accessError });

            if (!access) {
                // Check if this is the document owner from generation_jobs
                const { data: job } = await supabaseAdmin
                    .from('generation_jobs')
                    .select('user_id')
                    .eq('id', documentId)
                    .single();
                
                if (job && job.user_id === userId) {
                    console.log('✅ User is document owner (from generation_jobs), granting access');
                    // User is the owner but no record in collaborators table - create it
                    await supabaseAdmin
                        .from('document_collaborators')
                        .insert({
                            document_id: documentId,
                            user_id: userId,
                            role: 'owner',
                            status: 'accepted',
                            invited_by: userId
                        })
                        .select()
                        .single();
                } else {
                    return res.status(403).json({ error: 'No access to this document', debug: { userId, documentId, job } });
                }
            }

            // Get all collaborators (simplified query without join)
            const { data: collaborators, error } = await supabaseAdmin
                .from('document_collaborators')
                .select('*')
                .eq('document_id', documentId);

            if (error) {
                console.error('❌ Failed to fetch collaborators:', error);
                return res.status(500).json({ error: 'Failed to fetch collaborators', details: error.message });
            }

            // Fetch user details separately
            const enrichedCollaborators = await Promise.all(
                (collaborators || []).map(async (collab) => {
                    const { data: user } = await supabaseAdmin
                        .from('users')
                        .select('id, email, first_name, last_name')
                        .eq('id', collab.user_id)
                        .single();
                    
                    return {
                        ...collab,
                        users: user || { id: collab.user_id, email: 'Unknown', first_name: 'Unknown', last_name: 'User' }
                    };
                })
            );

            return res.json({
                status: 'success',
                data: enrichedCollaborators
            });

        } catch (error: any) {
            console.error('❌ Get collaborators error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Remove a collaborator from a document
     */
    private async removeCollaborator(req: Request, res: Response) {
        try {
            const { documentId, userId: targetUserId } = req.params;
            const requesterId = (req as any).user?.userId;

            // Check if requester is the owner
            const { data: ownership } = await supabaseAdmin
                .from('document_collaborators')
                .select('role')
                .eq('document_id', documentId)
                .eq('user_id', requesterId)
                .eq('role', 'owner')
                .single();

            if (!ownership) {
                return res.status(403).json({ error: 'Only owners can remove collaborators' });
            }

            // Cannot remove yourself (owner)
            if (requesterId === targetUserId) {
                return res.status(400).json({ error: 'Cannot remove yourself as owner' });
            }

            // Delete collaborator
            const { error } = await supabaseAdmin
                .from('document_collaborators')
                .delete()
                .eq('document_id', documentId)
                .eq('user_id', targetUserId);

            if (error) {
                return res.status(500).json({ error: 'Failed to remove collaborator' });
            }

            // Also end their active session if any
            await supabaseAdmin
                .from('collaboration_sessions')
                .delete()
                .eq('document_id', documentId)
                .eq('user_id', targetUserId);

            return res.json({
                status: 'success',
                message: 'Collaborator removed'
            });

        } catch (error: any) {
            console.error('❌ Remove collaborator error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Accept an invitation
     */
    private async acceptInvite(req: Request, res: Response) {
        try {
            const { token } = req.params;
            const userId = (req as any).user?.userId;

            // Find invite
            const { data: invite, error: inviteError } = await supabaseAdmin
                .from('collaboration_invites')
                .select('*')
                .eq('invite_token', token)
                .eq('status', 'pending')
                .single();

            if (inviteError || !invite) {
                return res.status(404).json({ error: 'Invalid or expired invitation' });
            }

            // Check if expired
            if (new Date(invite.expires_at) < new Date()) {
                await supabaseAdmin
                    .from('collaboration_invites')
                    .update({ status: 'expired' })
                    .eq('id', invite.id);
                
                return res.status(400).json({ error: 'Invitation has expired' });
            }

            // EDGE CASE: If invite was for email but user_id wasn't set (user registered after invite)
            // Update the invite with the user_id
            if (!invite.invitee_user_id) {
                console.log('📝 Updating invite with new user_id (user registered after invite was sent)');
                await supabaseAdmin
                    .from('collaboration_invites')
                    .update({ invitee_user_id: userId })
                    .eq('id', invite.id);
            }

            // Add user as collaborator
            const { error: collabError } = await supabaseAdmin
                .from('document_collaborators')
                .insert({
                    document_id: invite.document_id,
                    user_id: userId,
                    role: invite.role,
                    status: 'accepted',
                    invited_by: invite.invited_by,
                    invited_at: invite.created_at,
                    accepted_at: new Date().toISOString()
                });

            if (collabError) {
                console.error('❌ Failed to add collaborator:', collabError);
                
                // Check if it's a duplicate or limit error
                if (collabError.message?.includes('Maximum of 5')) {
                    return res.status(400).json({ error: 'Document has reached maximum collaborators' });
                }
                if (collabError.message?.includes('duplicate') || collabError.code === '23505') {
                    return res.status(400).json({ error: 'You already have access to this document' });
                }
                return res.status(500).json({ error: 'Failed to accept invitation', details: collabError.message });
            }

            // Mark invite as accepted
            await supabaseAdmin
                .from('collaboration_invites')
                .update({ 
                    status: 'accepted',
                    accepted_at: new Date().toISOString()
                })
                .eq('id', invite.id);

            console.log(`✅ Invitation accepted! User ${userId} added to document ${invite.document_id} as ${invite.role}`);

            return res.json({
                status: 'success',
                message: 'Invitation accepted successfully',
                data: {
                    documentId: invite.document_id,
                    role: invite.role
                }
            });

        } catch (error: any) {
            console.error('❌ Accept invite error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Start a collaboration session (user opened document)
     */
    private async startSession(req: Request, res: Response) {
        try {
            const { documentId, sessionId, userColor } = req.body;
            const userId = (req as any).user?.userId;

            if (!documentId || !sessionId) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            console.log(`📍 Session start request:`, { documentId, userId, sessionId });

            // Check if user has access (with fallback to document owner)
            let hasAccess = false;
            
            // Check document_collaborators first
            const { data: access } = await supabaseAdmin
                .from('document_collaborators')
                .select('role')
                .eq('document_id', documentId)
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .single();

            if (access) {
                hasAccess = true;
                console.log(`✅ User has access via document_collaborators:`, access.role);
            } else {
                // Fallback: Check if user is document owner via generation_jobs
                const { data: job } = await supabaseAdmin
                    .from('generation_jobs')
                    .select('user_id')
                    .eq('id', documentId)
                    .single();
                
                if (job && job.user_id === userId) {
                    hasAccess = true;
                    console.log(`✅ User is document owner (from generation_jobs)`);
                    
                    // Auto-add as owner in document_collaborators
                    await supabaseAdmin
                        .from('document_collaborators')
                        .insert({
                            document_id: documentId,
                            user_id: userId,
                            role: 'owner',
                            status: 'accepted',
                            invited_by: userId
                        })
                        .select()
                        .single();
                    
                    console.log(`✅ Auto-added as owner in document_collaborators`);
                }
            }

            if (!hasAccess) {
                return res.status(403).json({ error: 'No access to this document' });
            }

            // Upsert session (insert or update if exists)
            const { error } = await supabaseAdmin
                .from('collaboration_sessions')
                .upsert({
                    document_id: documentId,
                    user_id: userId,
                    session_id: sessionId,
                    user_color: userColor || '#3b82f6',
                    is_active: true,
                    last_seen: new Date().toISOString()
                }, {
                    onConflict: 'document_id,user_id'
                });

            if (error) {
                return res.status(500).json({ error: 'Failed to start session' });
            }

            return res.json({
                status: 'success',
                message: 'Session started'
            });

        } catch (error: any) {
            console.error('❌ Start session error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * End a collaboration session (user closed document)
     */
    private async endSession(req: Request, res: Response) {
        try {
            const { documentId } = req.body;
            const userId = (req as any).user?.userId;

            await supabaseAdmin
                .from('collaboration_sessions')
                .delete()
                .eq('document_id', documentId)
                .eq('user_id', userId);

            return res.json({
                status: 'success',
                message: 'Session ended'
            });

        } catch (error: any) {
            console.error('❌ End session error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Get active users for a document
     */
    private async getActiveUsers(req: Request, res: Response) {
        try {
            const { documentId } = req.params;
            const userId = (req as any).user?.userId;

            // Check access
            const { data: access } = await supabaseAdmin
                .from('document_collaborators')
                .select('role')
                .eq('document_id', documentId)
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .single();

            if (!access) {
                return res.status(403).json({ error: 'No access to this document' });
            }

            // Get active sessions (last seen within 5 minutes)
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

            const { data: sessions, error } = await supabaseAdmin
                .from('collaboration_sessions')
                .select('*')
                .eq('document_id', documentId)
                .eq('is_active', true)
                .gte('last_seen', fiveMinutesAgo);

            if (error) {
                console.error('❌ Failed to fetch active users:', error);
                return res.status(500).json({ error: 'Failed to fetch active users' });
            }

            // Enrich with user details
            const enrichedSessions = await Promise.all(
                (sessions || []).map(async (session) => {
                    const { data: user } = await supabaseAdmin
                        .from('users')
                        .select('id, email, first_name, last_name')
                        .eq('id', session.user_id)
                        .single();
                    
                    return {
                        ...session,
                        users: user || { id: session.user_id, email: 'Unknown', first_name: 'Unknown', last_name: 'User' }
                    };
                })
            );

            return res.json({
                status: 'success',
                data: enrichedSessions
            });

        } catch (error: any) {
            console.error('❌ Get active users error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

export default CollaborationController;
