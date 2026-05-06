/**
 * Collab Projects Controller
 * 
 * Handles collab project (workspace/folder) features:
 * - Creating collab projects
 * - Managing members
 * - Adding/removing documents
 * - Listing user's collabs
 * 
 * SAFE: This is a NEW file, doesn't modify existing controllers
 */

import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { supabaseAdmin } from '../lib/supabase';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import postmarkService from '../services/PostmarkService';

export class CollabProjectsController extends BaseController {
    public basePath = '/collab-projects';

    constructor() {
        super();
    }

    protected initializeRoutes(): void {
        this.routes = [
            {
                verb: 'POST',
                path: '/',
                middlewares: [authenticateToken],
                handler: this.createCollabProject.bind(this),
            },
            {
                verb: 'GET',
                path: '/',
                middlewares: [authenticateToken],
                handler: this.getUserCollabProjects.bind(this),
            },
            {
                verb: 'GET',
                path: '/:projectId',
                middlewares: [authenticateToken],
                handler: this.getCollabProjectDetails.bind(this),
            },
            {
                verb: 'PATCH',
                path: '/:projectId',
                middlewares: [authenticateToken],
                handler: this.updateCollabProject.bind(this),
            },
            {
                verb: 'DELETE',
                path: '/:projectId',
                middlewares: [authenticateToken],
                handler: this.deleteCollabProject.bind(this),
            },
            {
                verb: 'POST',
                path: '/:projectId/members',
                middlewares: [authenticateToken],
                handler: this.inviteMember.bind(this),
            },
            {
                verb: 'DELETE',
                path: '/:projectId/members/:userId',
                middlewares: [authenticateToken],
                handler: this.removeMember.bind(this),
            },
            {
                verb: 'PATCH',
                path: '/:projectId/members/:userId',
                middlewares: [authenticateToken],
                handler: this.updateMemberRole.bind(this),
            },
            {
                verb: 'POST',
                path: '/:projectId/documents',
                middlewares: [authenticateToken],
                handler: this.addDocumentToCollab.bind(this),
            },
            {
                verb: 'DELETE',
                path: '/:projectId/documents/:documentId',
                middlewares: [authenticateToken],
                handler: this.removeDocumentFromCollab.bind(this),
            },
            {
                verb: 'GET',
                path: '/:projectId/documents',
                middlewares: [authenticateToken],
                handler: this.getCollabDocuments.bind(this),
            },
        ];
    }

    /**
     * Create a new collab project
     */
    private async createCollabProject(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { name, coverImage, purposeNotes, tags, inviteEmails, role } = req.body;

            if (!name || !name.trim()) {
                return res.status(400).json({ 
                    status: 'error',
                    message: 'Collab name is required' 
                });
            }

            console.log(`🚀 Creating collab project: "${name}" by user ${userId}`);

            // Create the collab project
            const { data: project, error: projectError } = await supabaseAdmin
                .from('collab_projects')
                .insert({
                    name: name.trim(),
                    cover_image: coverImage || null,
                    purpose_notes: purposeNotes || null,
                    tags: tags || [],
                    created_by: userId,
                    status: 'active'
                })
                .select()
                .single();

            if (projectError) throw projectError;

            console.log(`✅ Collab project created: ${project.id}`);

            // Add creator as owner/member
            const { error: memberError } = await supabaseAdmin
                .from('collab_project_members')
                .insert({
                    collab_project_id: project.id,
                    user_id: userId,
                    role: 'owner',
                    status: 'accepted',
                    invited_by: userId,
                    accepted_at: new Date().toISOString()
                });

            if (memberError) {
                console.error('⚠️ Failed to add creator as owner:', memberError);
            }

            // Invite users if provided
            if (inviteEmails && Array.isArray(inviteEmails) && inviteEmails.length > 0) {
                console.log(`📧 Inviting ${inviteEmails.length} users to collab...`);

                for (const email of inviteEmails) {
                    try {
                        // Find user by email
                        const { data: user } = await supabaseAdmin
                            .from('users')
                            .select('id')
                            .eq('email', email.toLowerCase().trim())
                            .single();

                        if (user) {
                            // Add as member
                            await supabaseAdmin
                                .from('collab_project_members')
                                .insert({
                                    collab_project_id: project.id,
                                    user_id: user.id,
                                    role: role || 'editor',
                                    status: 'accepted',
                                    invited_by: userId,
                                    accepted_at: new Date().toISOString()
                                });

                            console.log(`✅ Added ${email} as ${role || 'editor'}`);
                        } else {
                            console.log(`⚠️ User ${email} not found, skipping`);
                        }
                    } catch (err) {
                        console.error(`❌ Failed to invite ${email}:`, err);
                    }
                }
            }

            return res.json({
                status: 'success',
                message: 'Collab project created successfully',
                data: project
            });

        } catch (error: any) {
            console.error('❌ Create collab project error:', error);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error', 
                details: error.message 
            });
        }
    }

    /**
     * Get all collab projects for the current user
     */
    private async getUserCollabProjects(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;

            console.log(`📊 Fetching collab projects for user ${userId}`);

            // Get all collab projects where user is a member
            const { data: memberships, error: membershipsError } = await supabaseAdmin
                .from('collab_project_members')
                .select('collab_project_id, role')
                .eq('user_id', userId)
                .eq('status', 'accepted');

            if (membershipsError) throw membershipsError;

            if (!memberships || memberships.length === 0) {
                return res.json({
                    status: 'success',
                    data: []
                });
            }

            const projectIds = memberships.map(m => m.collab_project_id);

            // Get project details
            const { data: projects, error: projectsError } = await supabaseAdmin
                .from('collab_projects')
                .select('*')
                .in('id', projectIds)
                .neq('status', 'deleted')
                .order('updated_at', { ascending: false });

            if (projectsError) throw projectsError;

            // Get member count for each project
            const projectsWithCounts = await Promise.all(
                (projects || []).map(async (project) => {
                    const { count } = await supabaseAdmin
                        .from('collab_project_members')
                        .select('*', { count: 'exact', head: true })
                        .eq('collab_project_id', project.id)
                        .eq('status', 'accepted');

                    const { count: docCount } = await supabaseAdmin
                        .from('collab_project_documents')
                        .select('*', { count: 'exact', head: true })
                        .eq('collab_project_id', project.id);

                    const userRole = memberships.find(m => m.collab_project_id === project.id)?.role;

                    return {
                        ...project,
                        memberCount: count || 0,
                        documentCount: docCount || 0,
                        userRole: userRole
                    };
                })
            );

            console.log(`✅ Found ${projectsWithCounts.length} collab projects`);

            return res.json({
                status: 'success',
                data: projectsWithCounts
            });

        } catch (error: any) {
            console.error('❌ Get collab projects error:', error);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error',
                details: error.message 
            });
        }
    }

    /**
     * Get collab project details with members and documents
     */
    private async getCollabProjectDetails(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { projectId } = req.params;

            // Check if user has access
            const { data: membership } = await supabaseAdmin
                .from('collab_project_members')
                .select('role')
                .eq('collab_project_id', projectId)
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .single();

            if (!membership) {
                return res.status(403).json({ 
                    status: 'error',
                    message: 'No access to this collab project' 
                });
            }

            // Get project details
            const { data: project, error: projectError } = await supabaseAdmin
                .from('collab_projects')
                .select('*')
                .eq('id', projectId)
                .single();

            if (projectError || !project) {
                return res.status(404).json({ 
                    status: 'error',
                    message: 'Collab project not found' 
                });
            }

            // Get members with user details
            const { data: members } = await supabaseAdmin
                .from('collab_project_members')
                .select(`
                    id,
                    role,
                    status,
                    invited_at,
                    accepted_at,
                    users!collab_project_members_user_id_fkey (
                        id,
                        email,
                        first_name,
                        last_name
                    )
                `)
                .eq('collab_project_id', projectId)
                .eq('status', 'accepted');

            // Get documents in this collab
            const { data: collabDocs } = await supabaseAdmin
                .from('collab_project_documents')
                .select('document_id, added_at')
                .eq('collab_project_id', projectId);

            const docIds = (collabDocs || []).map(d => d.document_id);
            let documents = [];

            if (docIds.length > 0) {
                const { data: docs } = await supabaseAdmin
                    .from('generation_jobs')
                    .select('*')
                    .in('id', docIds)
                    .neq('status', 'DELETED');

                documents = docs || [];
            }

            return res.json({
                status: 'success',
                data: {
                    ...project,
                    members: members || [],
                    documents: documents,
                    userRole: membership.role
                }
            });

        } catch (error: any) {
            console.error('❌ Get collab project details error:', error);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error',
                details: error.message 
            });
        }
    }

    /**
     * Update collab project
     */
    private async updateCollabProject(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { projectId } = req.params;
            const { name, coverImage, purposeNotes, tags } = req.body;

            // Check if user is owner/admin
            const { data: membership } = await supabaseAdmin
                .from('collab_project_members')
                .select('role')
                .eq('collab_project_id', projectId)
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .in('role', ['owner', 'admin'])
                .single();

            if (!membership) {
                return res.status(403).json({ 
                    status: 'error',
                    message: 'Only owners and admins can update collab projects' 
                });
            }

            // Update project
            const updateData: any = {
                updated_at: new Date().toISOString()
            };

            if (name) updateData.name = name.trim();
            if (coverImage !== undefined) updateData.cover_image = coverImage;
            if (purposeNotes !== undefined) updateData.purpose_notes = purposeNotes;
            if (tags) updateData.tags = tags;

            const { error: updateError } = await supabaseAdmin
                .from('collab_projects')
                .update(updateData)
                .eq('id', projectId);

            if (updateError) throw updateError;

            console.log(`✅ Updated collab project ${projectId}`);

            return res.json({
                status: 'success',
                message: 'Collab project updated successfully'
            });

        } catch (error: any) {
            console.error('❌ Update collab project error:', error);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error',
                details: error.message 
            });
        }
    }

    /**
     * Delete (archive) collab project
     */
    private async deleteCollabProject(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { projectId } = req.params;

            // Check if user is owner
            const { data: membership } = await supabaseAdmin
                .from('collab_project_members')
                .select('role')
                .eq('collab_project_id', projectId)
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .eq('role', 'owner')
                .single();

            if (!membership) {
                return res.status(403).json({ 
                    status: 'error',
                    message: 'Only owners can delete collab projects' 
                });
            }

            // Soft delete (mark as deleted)
            const { error: deleteError } = await supabaseAdmin
                .from('collab_projects')
                .update({ 
                    status: 'deleted',
                    updated_at: new Date().toISOString()
                })
                .eq('id', projectId);

            if (deleteError) throw deleteError;

            console.log(`🗑️ User ${userId} deleted collab project ${projectId}`);

            return res.json({
                status: 'success',
                message: 'Collab project deleted successfully'
            });

        } catch (error: any) {
            console.error('❌ Delete collab project error:', error);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error',
                details: error.message 
            });
        }
    }

    /**
     * Invite a member to collab project
     */
    private async inviteMember(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { projectId } = req.params;
            const { email, role } = req.body;

            if (!email || !email.includes('@')) {
                return res.status(400).json({ 
                    status: 'error',
                    message: 'Valid email is required' 
                });
            }

            // Check if user is owner/admin
            const { data: membership } = await supabaseAdmin
                .from('collab_project_members')
                .select('role')
                .eq('collab_project_id', projectId)
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .in('role', ['owner', 'admin'])
                .single();

            if (!membership) {
                return res.status(403).json({ 
                    status: 'error',
                    message: 'Only owners and admins can invite members' 
                });
            }

            // Find user by email
            let { data: invitedUser } = await supabaseAdmin
                .from('users')
                .select('id, email, first_name, last_name')
                .eq('email', email.toLowerCase().trim())
                .single();

            let userCreated = false;
            let defaultPassword = '';

            // If user doesn't exist, create them automatically
            if (!invitedUser) {
                console.log(`📝 User ${email} doesn't exist. Creating account...`);
                
                try {
                    const emailPrefix = email.split('@')[0];
                    defaultPassword = 'Manifestr123!'; // Default password for invited users
                    
                    // Create user in Supabase Auth
                    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
                        email: email.toLowerCase().trim(),
                        password: defaultPassword,
                        email_confirm: true, // Auto-confirm email
                        user_metadata: {
                            first_name: emailPrefix,
                            last_name: '',
                            invited_user: true
                        }
                    });

                    if (authError) {
                        console.error('❌ Failed to create auth user:', authError);
                        throw authError;
                    }

                    const newUserId = authUser.user.id;
                    console.log(`✅ Auth user created: ${newUserId}`);

                    // Create user record in users table
                    const { error: userInsertError } = await supabaseAdmin
                        .from('users')
                        .insert({
                            id: newUserId,
                            email: email.toLowerCase().trim(),
                            first_name: emailPrefix,
                            last_name: '',
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
                            console.log('⚠️ User already exists in users table (duplicate, OK)');
                        } else {
                            console.error('❌ Failed to create in users table:', userInsertError);
                            throw userInsertError;
                        }
                    } else {
                        console.log('✅ User created in users table');
                    }
                    
                    // Fetch the created user
                    const { data: verifyUser } = await supabaseAdmin
                        .from('users')
                        .select('id, email, first_name, last_name')
                        .eq('id', newUserId)
                        .single();
                    
                    if (!verifyUser) {
                        throw new Error('User was not created in users table despite successful insert');
                    }
                    
                    invitedUser = verifyUser;
                    userCreated = true;
                    console.log('✅ Verified user exists:', verifyUser);
                    
                } catch (createError) {
                    console.error('❌ Failed to create user:', createError);
                    return res.status(500).json({ 
                        status: 'error',
                        message: 'Could not create user account. Please try again.',
                        details: (createError as Error).message 
                    });
                }
            }

            // Check if already a member
            const { data: existing } = await supabaseAdmin
                .from('collab_project_members')
                .select('id')
                .eq('collab_project_id', projectId)
                .eq('user_id', invitedUser.id)
                .single();

            if (existing) {
                return res.status(400).json({ 
                    status: 'error',
                    message: 'User is already a member of this collab' 
                });
            }

            // Add member
            const { error: addError } = await supabaseAdmin
                .from('collab_project_members')
                .insert({
                    collab_project_id: projectId,
                    user_id: invitedUser.id,
                    role: role || 'editor',
                    status: 'accepted',
                    invited_by: userId,
                    accepted_at: new Date().toISOString()
                });

            if (addError) throw addError;

            console.log(`✅ Invited ${email} to collab ${projectId} as ${role || 'editor'}`);

            // Get inviter details for email
            const { data: inviter } = await supabaseAdmin
                .from('users')
                .select('first_name, last_name, email')
                .eq('id', userId)
                .single();
            
            const inviterName = inviter 
                ? `${inviter.first_name} ${inviter.last_name}`.trim() || inviter.email 
                : 'Someone';

            // Get project details for email
            const { data: project } = await supabaseAdmin
                .from('collab_projects')
                .select('name')
                .eq('id', projectId)
                .single();
            
            const projectName = project?.name || 'Collab Project';

            // Send email notification
            const inviteeName = `${invitedUser.first_name} ${invitedUser.last_name}`.trim() || invitedUser.email.split('@')[0];
            const inviteLink = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/vault/collabs/${projectId}`;

            try {
                await postmarkService.sendCollabProjectInvite({
                    inviteeEmail: email,
                    inviteeName: inviteeName,
                    inviterName: inviterName,
                    projectName: projectName,
                    role: role || 'editor',
                    inviteLink: inviteLink,
                    accountCreated: userCreated,
                    defaultPassword: userCreated ? defaultPassword : undefined
                });
                console.log(`📧 Collab project invite email sent to ${email}`);
            } catch (emailError) {
                console.error(`⚠️ Failed to send email to ${email}:`, emailError);
                // Continue anyway - member was added successfully
            }

            const responseMessage = userCreated
                ? `Member invited successfully! Account created with password: ${defaultPassword}. An email has been sent with login details.`
                : `Member invited successfully! An invitation email has been sent.`;

            return res.json({
                status: 'success',
                message: responseMessage,
                data: {
                    user: invitedUser,
                    role: role || 'editor',
                    userCreated: userCreated,
                    defaultPassword: userCreated ? defaultPassword : undefined
                }
            });

        } catch (error: any) {
            console.error('❌ Invite member error:', error);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error',
                details: error.message 
            });
        }
    }

    /**
     * Remove a member from collab project
     */
    private async removeMember(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { projectId, userId: targetUserId } = req.params;

            // Check if user is owner/admin
            const { data: membership } = await supabaseAdmin
                .from('collab_project_members')
                .select('role')
                .eq('collab_project_id', projectId)
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .in('role', ['owner', 'admin'])
                .single();

            if (!membership) {
                return res.status(403).json({ 
                    status: 'error',
                    message: 'Only owners and admins can remove members' 
                });
            }

            // Can't remove owner
            const { data: targetMember } = await supabaseAdmin
                .from('collab_project_members')
                .select('role')
                .eq('collab_project_id', projectId)
                .eq('user_id', targetUserId)
                .single();

            if (targetMember?.role === 'owner') {
                return res.status(400).json({ 
                    status: 'error',
                    message: 'Cannot remove the owner' 
                });
            }

            // Remove member
            const { error: removeError } = await supabaseAdmin
                .from('collab_project_members')
                .delete()
                .eq('collab_project_id', projectId)
                .eq('user_id', targetUserId);

            if (removeError) throw removeError;

            console.log(`✅ Removed member ${targetUserId} from collab ${projectId}`);

            return res.json({
                status: 'success',
                message: 'Member removed successfully'
            });

        } catch (error: any) {
            console.error('❌ Remove member error:', error);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error',
                details: error.message 
            });
        }
    }

    /**
     * Update member role
     */
    private async updateMemberRole(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { projectId, userId: targetUserId } = req.params;
            const { role } = req.body;

            if (!role || !['admin', 'editor', 'viewer'].includes(role)) {
                return res.status(400).json({ 
                    status: 'error',
                    message: 'Valid role is required (admin, editor, viewer)' 
                });
            }

            // Check if user is owner/admin
            const { data: membership } = await supabaseAdmin
                .from('collab_project_members')
                .select('role')
                .eq('collab_project_id', projectId)
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .in('role', ['owner', 'admin'])
                .single();

            if (!membership) {
                return res.status(403).json({ 
                    status: 'error',
                    message: 'Only owners and admins can update member roles' 
                });
            }

            // Can't change owner role
            const { data: targetMember } = await supabaseAdmin
                .from('collab_project_members')
                .select('role')
                .eq('collab_project_id', projectId)
                .eq('user_id', targetUserId)
                .single();

            if (targetMember?.role === 'owner') {
                return res.status(400).json({ 
                    status: 'error',
                    message: 'Cannot change owner role' 
                });
            }

            // Update role
            const { error: updateError } = await supabaseAdmin
                .from('collab_project_members')
                .update({ role })
                .eq('collab_project_id', projectId)
                .eq('user_id', targetUserId);

            if (updateError) throw updateError;

            console.log(`✅ Updated member ${targetUserId} role to ${role} in collab ${projectId}`);

            return res.json({
                status: 'success',
                message: 'Member role updated successfully'
            });

        } catch (error: any) {
            console.error('❌ Update member role error:', error);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error',
                details: error.message 
            });
        }
    }

    /**
     * Add a document to collab project
     */
    private async addDocumentToCollab(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { projectId } = req.params;
            const { documentId } = req.body;

            if (!documentId) {
                return res.status(400).json({ 
                    status: 'error',
                    message: 'Document ID is required' 
                });
            }

            // Check if user has access to the collab
            const { data: membership } = await supabaseAdmin
                .from('collab_project_members')
                .select('role')
                .eq('collab_project_id', projectId)
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .single();

            if (!membership) {
                return res.status(403).json({ 
                    status: 'error',
                    message: 'No access to this collab project' 
                });
            }

            // Check if user owns or has access to the document
            const { data: doc } = await supabaseAdmin
                .from('generation_jobs')
                .select('id, user_id')
                .eq('id', documentId)
                .single();

            if (!doc) {
                return res.status(404).json({ 
                    status: 'error',
                    message: 'Document not found' 
                });
            }

            const isOwner = doc.user_id === userId;
            let hasDocAccess = isOwner;

            if (!isOwner) {
                const { data: collab } = await supabaseAdmin
                    .from('document_collaborators')
                    .select('id')
                    .eq('document_id', documentId)
                    .eq('user_id', userId)
                    .eq('status', 'accepted')
                    .single();

                hasDocAccess = !!collab;
            }

            if (!hasDocAccess) {
                return res.status(403).json({ 
                    status: 'error',
                    message: 'No access to this document' 
                });
            }

            // Add document to collab
            const { error: addError } = await supabaseAdmin
                .from('collab_project_documents')
                .insert({
                    collab_project_id: projectId,
                    document_id: documentId,
                    added_by: userId
                });

            if (addError) {
                if (addError.code === '23505') {
                    return res.status(400).json({ 
                        status: 'error',
                        message: 'Document already in this collab' 
                    });
                }
                throw addError;
            }

            console.log(`✅ Added document ${documentId} to collab ${projectId}`);

            return res.json({
                status: 'success',
                message: 'Document added to collab successfully'
            });

        } catch (error: any) {
            console.error('❌ Add document to collab error:', error);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error',
                details: error.message 
            });
        }
    }

    /**
     * Remove a document from collab project
     */
    private async removeDocumentFromCollab(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { projectId, documentId } = req.params;

            // Check if user has access
            const { data: membership } = await supabaseAdmin
                .from('collab_project_members')
                .select('role')
                .eq('collab_project_id', projectId)
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .in('role', ['owner', 'admin', 'editor'])
                .single();

            if (!membership) {
                return res.status(403).json({ 
                    status: 'error',
                    message: 'No access to modify this collab' 
                });
            }

            // Remove document
            const { error: removeError } = await supabaseAdmin
                .from('collab_project_documents')
                .delete()
                .eq('collab_project_id', projectId)
                .eq('document_id', documentId);

            if (removeError) throw removeError;

            console.log(`✅ Removed document ${documentId} from collab ${projectId}`);

            return res.json({
                status: 'success',
                message: 'Document removed from collab successfully'
            });

        } catch (error: any) {
            console.error('❌ Remove document from collab error:', error);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error',
                details: error.message 
            });
        }
    }

    /**
     * Get all documents in a collab project
     */
    private async getCollabDocuments(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const { projectId } = req.params;

            // Check if user has access
            const { data: membership } = await supabaseAdmin
                .from('collab_project_members')
                .select('role')
                .eq('collab_project_id', projectId)
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .single();

            if (!membership) {
                return res.status(403).json({ 
                    status: 'error',
                    message: 'No access to this collab project' 
                });
            }

            // Get documents in this collab
            const { data: collabDocs } = await supabaseAdmin
                .from('collab_project_documents')
                .select('document_id, added_at, added_by')
                .eq('collab_project_id', projectId)
                .order('added_at', { ascending: false });

            const docIds = (collabDocs || []).map(d => d.document_id);
            let documents: any[] = [];

            if (docIds.length > 0) {
                const { data: docs } = await supabaseAdmin
                    .from('generation_jobs')
                    .select('*')
                    .in('id', docIds)
                    .neq('status', 'DELETED');

                documents = (docs || []).map(doc => ({
                    id: doc.id,
                    title: doc.title || doc.input_data?.title || 'Untitled',
                    coverImage: doc.cover_image || doc.input_data?.cover_image,
                    type: doc.type || doc.output_type || doc.input_data?.output || 'document',
                    status: doc.status,
                    createdAt: doc.created_at,
                    updatedAt: doc.updated_at
                }));
            }

            return res.json({
                status: 'success',
                data: documents
            });

        } catch (error: any) {
            console.error('❌ Get collab documents error:', error);
            return res.status(500).json({ 
                status: 'error',
                message: 'Internal server error',
                details: error.message 
            });
        }
    }
}

export default CollabProjectsController;
