import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { supabaseAdmin } from '../lib/supabase';
import { AuthRequest, authenticateToken } from '../middleware/auth.middleware';

interface CreateThreadRequest {
    documentId: string;
    documentType: 'image' | 'presentation' | 'spreadsheet' | 'document' | 'chart';
    title?: string;
    locationContext?: string;
    initialMessage: string;
    assignedTo?: string[];
    priority?: 'low' | 'normal' | 'high' | 'urgent';
}

interface AddMessageRequest {
    threadId: string;
    content: string;
}

interface UpdateThreadRequest {
    status?: 'open' | 'in_progress' | 'done' | 'alert';
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    assignedTo?: string[];
    dueDate?: string;
}

interface AddReactionRequest {
    messageId: string;
    reactionType: 'like' | 'love' | 'happy';
}

export class ThreadsController extends BaseController {
    public basePath = '/threads';

    constructor() {
        super();
    }

    protected initializeRoutes(): void {
        this.routes = [
            // Get all threads for a document
            {
                verb: 'GET',
                path: '/document/:documentId',
                handler: this.getThreadsForDocument.bind(this),
                middlewares: [authenticateToken]
            },
            // Create a new thread
            {
                verb: 'POST',
                path: '/create',
                handler: this.createThread.bind(this),
                middlewares: [authenticateToken]
            },
            // Add message to thread
            {
                verb: 'POST',
                path: '/message',
                handler: this.addMessage.bind(this),
                middlewares: [authenticateToken]
            },
            // Update thread (status, priority, etc.)
            {
                verb: 'PATCH',
                path: '/:threadId',
                handler: this.updateThread.bind(this),
                middlewares: [authenticateToken]
            },
            // Add/toggle reaction
            {
                verb: 'POST',
                path: '/reaction',
                handler: this.toggleReaction.bind(this),
                middlewares: [authenticateToken]
            },
            // Delete thread
            {
                verb: 'DELETE',
                path: '/:threadId',
                handler: this.deleteThread.bind(this),
                middlewares: [authenticateToken]
            },
        ];
    }

    // GET /threads/document/:documentId
    private async getThreadsForDocument(req: AuthRequest, res: Response) {
        try {
            const { documentId } = req.params;
            const userId = req.user!.userId;

            console.log(`💬 Fetching threads for document: ${documentId}`);

            // 1. Get all threads for this document
            const { data: threads, error: threadsError } = await supabaseAdmin
                .from('threads')
                .select(`
                    *,
                    messages:thread_messages(
                        *,
                        reactions:thread_reactions(*)
                    )
                `)
                .eq('document_id', documentId)
                .order('created_at', { ascending: false });

            if (threadsError) {
                console.error('❌ Error fetching threads:', threadsError);
                return res.status(500).json({ error: 'Failed to fetch threads' });
            }

            // 2. Calculate stats
            const stats = {
                total: threads?.length || 0,
                open: threads?.filter(t => t.status === 'open').length || 0,
                done: threads?.filter(t => t.status === 'done').length || 0,
                alert: threads?.filter(t => t.status === 'alert').length || 0,
            };

            console.log(`✅ Found ${threads?.length || 0} threads`);

            return res.json({
                status: 'success',
                data: {
                    threads: threads || [],
                    stats
                }
            });

        } catch (error: any) {
            console.error('❌ Get threads failed:', error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }

    // POST /threads/create
    private async createThread(req: AuthRequest, res: Response) {
        try {
            const { 
                documentId, 
                documentType, 
                title, 
                locationContext, 
                initialMessage,
                assignedTo,
                priority 
            } = req.body as CreateThreadRequest;

            const userId = req.user!.userId;
            const userName = req.user!.email || 'Anonymous';
            const userAvatar = null; // TODO: Add avatar support later

            console.log(`💬 Creating thread for ${documentType}: ${documentId}`);

            // 1. Create thread
            const { data: thread, error: threadError } = await supabaseAdmin
                .from('threads')
                .insert({
                    document_id: documentId,
                    document_type: documentType,
                    title: title || initialMessage.substring(0, 100),
                    location_context: locationContext,
                    status: 'open',
                    priority: priority || 'normal',
                    assigned_to: assignedTo || [],
                    created_by: userId
                })
                .select()
                .single();

            if (threadError) {
                console.error('❌ Error creating thread:', threadError);
                return res.status(500).json({ error: 'Failed to create thread' });
            }

            // 2. Add initial message
            const { data: message, error: messageError } = await supabaseAdmin
                .from('thread_messages')
                .insert({
                    thread_id: thread.id,
                    content: initialMessage,
                    user_id: userId,
                    user_name: userName,
                    user_avatar: userAvatar
                })
                .select()
                .single();

            if (messageError) {
                console.error('❌ Error creating message:', messageError);
                return res.status(500).json({ error: 'Failed to create message' });
            }

            console.log(`✅ Thread created: ${thread.id}`);

            return res.json({
                status: 'success',
                data: {
                    thread,
                    message
                }
            });

        } catch (error: any) {
            console.error('❌ Create thread failed:', error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }

    // POST /threads/message
    private async addMessage(req: AuthRequest, res: Response) {
        try {
            const { threadId, content } = req.body as AddMessageRequest;
            const userId = req.user!.userId;
            const userName = req.user!.email || 'Anonymous';
            const userAvatar = null; // TODO: Add avatar support later

            console.log(`💬 Adding message to thread: ${threadId}`);

            // Add message
            const { data: message, error: messageError } = await supabaseAdmin
                .from('thread_messages')
                .insert({
                    thread_id: threadId,
                    content,
                    user_id: userId,
                    user_name: userName,
                    user_avatar: userAvatar
                })
                .select()
                .single();

            if (messageError) {
                console.error('❌ Error adding message:', messageError);
                return res.status(500).json({ error: 'Failed to add message' });
            }

            // Update thread timestamp
            await supabaseAdmin
                .from('threads')
                .update({ updated_at: new Date().toISOString() })
                .eq('id', threadId);

            console.log(`✅ Message added: ${message.id}`);

            return res.json({
                status: 'success',
                data: { message }
            });

        } catch (error: any) {
            console.error('❌ Add message failed:', error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }

    // PATCH /threads/:threadId
    private async updateThread(req: AuthRequest, res: Response) {
        try {
            const { threadId } = req.params;
            const updates = req.body as UpdateThreadRequest;
            const userId = req.user!.userId;

            console.log(`💬 Updating thread: ${threadId}`);

            // Prepare update object
            const updateData: any = {
                updated_at: new Date().toISOString()
            };

            if (updates.status) {
                updateData.status = updates.status;
                
                // If marking as done, set resolved info
                if (updates.status === 'done') {
                    updateData.resolved_at = new Date().toISOString();
                    updateData.resolved_by = userId;
                }
            }

            if (updates.priority) updateData.priority = updates.priority;
            if (updates.assignedTo) updateData.assigned_to = updates.assignedTo;
            if (updates.dueDate) updateData.due_date = updates.dueDate;

            // Update thread
            const { data: thread, error: updateError } = await supabaseAdmin
                .from('threads')
                .update(updateData)
                .eq('id', threadId)
                .select()
                .single();

            if (updateError) {
                console.error('❌ Error updating thread:', updateError);
                return res.status(500).json({ error: 'Failed to update thread' });
            }

            console.log(`✅ Thread updated: ${threadId}`);

            return res.json({
                status: 'success',
                data: { thread }
            });

        } catch (error: any) {
            console.error('❌ Update thread failed:', error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }

    // POST /threads/reaction
    private async toggleReaction(req: AuthRequest, res: Response) {
        try {
            const { messageId, reactionType } = req.body as AddReactionRequest;
            const userId = req.user!.userId;
            const userName = req.user!.email || 'Anonymous';

            console.log(`💬 Toggling ${reactionType} reaction on message: ${messageId}`);

            // Check if reaction already exists
            const { data: existing, error: checkError } = await supabaseAdmin
                .from('thread_reactions')
                .select()
                .eq('message_id', messageId)
                .eq('user_id', userId)
                .eq('reaction_type', reactionType)
                .maybeSingle();

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('❌ Error checking reaction:', checkError);
                return res.status(500).json({ error: 'Failed to check reaction' });
            }

            if (existing) {
                // Remove reaction
                const { error: deleteError } = await supabaseAdmin
                    .from('thread_reactions')
                    .delete()
                    .eq('id', existing.id);

                if (deleteError) {
                    console.error('❌ Error removing reaction:', deleteError);
                    return res.status(500).json({ error: 'Failed to remove reaction' });
                }

                console.log(`✅ Reaction removed`);

                return res.json({
                    status: 'success',
                    data: { action: 'removed' }
                });

            } else {
                // Add reaction
                const { data: reaction, error: addError } = await supabaseAdmin
                    .from('thread_reactions')
                    .insert({
                        message_id: messageId,
                        reaction_type: reactionType,
                        user_id: userId,
                        user_name: userName
                    })
                    .select()
                    .single();

                if (addError) {
                    console.error('❌ Error adding reaction:', addError);
                    return res.status(500).json({ error: 'Failed to add reaction' });
                }

                console.log(`✅ Reaction added: ${reaction.id}`);

                return res.json({
                    status: 'success',
                    data: { action: 'added', reaction }
                });
            }

        } catch (error: any) {
            console.error('❌ Toggle reaction failed:', error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }

    // DELETE /threads/:threadId
    private async deleteThread(req: AuthRequest, res: Response) {
        try {
            const { threadId } = req.params;
            const userId = req.user!.userId;

            console.log(`💬 Deleting thread: ${threadId}`);

            // Delete thread (cascade will delete messages and reactions)
            const { error: deleteError } = await supabaseAdmin
                .from('threads')
                .delete()
                .eq('id', threadId)
                .eq('created_by', userId);  // Only creator can delete

            if (deleteError) {
                console.error('❌ Error deleting thread:', deleteError);
                return res.status(500).json({ error: 'Failed to delete thread' });
            }

            console.log(`✅ Thread deleted: ${threadId}`);

            return res.json({
                status: 'success',
                data: { message: 'Thread deleted successfully' }
            });

        } catch (error: any) {
            console.error('❌ Delete thread failed:', error);
            return res.status(500).json({ 
                error: 'Internal server error', 
                details: error instanceof Error ? error.message : String(error) 
            });
        }
    }
}

export default ThreadsController;
