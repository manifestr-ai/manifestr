import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import Anthropic from '@anthropic-ai/sdk';
import SupabaseDB from '../lib/supabase-db';
import { supabaseAdmin } from '../lib/supabase';
import { AIOrchestrator } from '../services/ai-orchestrator.service';
import { UserPromptSchema } from '../agents/protocols/types';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

export class AIController extends BaseController {
    public basePath = '/ai';
    private claude: Anthropic;
    private orchestrator: AIOrchestrator;

    constructor() {
        super();
        this.claude = new Anthropic({
            apiKey: process.env.CLAUDE_API_KEY
        });
        this.orchestrator = new AIOrchestrator();
    }

    protected initializeRoutes(): void {
        this.routes = [
            // Old Motivation Quote Endpoint
            { verb: 'GET', path: '/motivation-quote', handler: this.getMotivationQuote },

            // New Agentic Endpoints (Protected)
            { verb: 'POST', path: '/generate', handler: this.startGeneration, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/status/:id', handler: this.getJobStatus, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/generations', handler: this.getUserGenerations, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/recent-generations', handler: this.getRecentGenerations, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/recent-activity', handler: this.getRecentActivity, middlewares: [authenticateToken] },
            { verb: 'POST', path: '/pin/:documentId', handler: this.pinDocument, middlewares: [authenticateToken] },
            { verb: 'DELETE', path: '/pin/:documentId', handler: this.unpinDocument, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/pinned', handler: this.getPinnedDocuments, middlewares: [authenticateToken] },
            { verb: 'POST', path: '/archive/:documentId', handler: this.archiveDocument, middlewares: [authenticateToken] },
            { verb: 'POST', path: '/unarchive/:documentId', handler: this.unarchiveDocument, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/archived', handler: this.getArchivedDocuments, middlewares: [authenticateToken] },
            { verb: 'DELETE', path: '/generation/:id', handler: this.deleteGeneration, middlewares: [authenticateToken] },
            { verb: 'POST', path: '/restore/:documentId', handler: this.restoreDocument, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/deleted', handler: this.getDeletedDocuments, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/generation/:id', handler: this.getGenerationDetails, middlewares: [authenticateToken] },
            { verb: 'PATCH', path: '/generation/:id', handler: this.updateGeneration, middlewares: [authenticateToken] },
        ];
    }

    /**
     * @swagger
     * /ai/generation/{id}:
     *   patch:
     *     summary: Update generation content (Auto-save)
     *     tags: [AI]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               content:
     *                 type: object
     *                 description: The new JSON content
     *     responses:
     *       200:
     *         description: Content updated
     *       404:
     *         description: Job not found
     */
    private updateGeneration = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;
            const { content } = req.body;

            if (!content) {
                return res.status(400).json({ status: "error", message: "Content is required" });
            }

            // Auto-save (silent)

            // FIRST: Try to update as owner (wrap in try-catch because it throws on 0 rows)
            let updated = null;
            try {
                updated = await SupabaseDB.updateGenerationJob(id, userId, {
                    result: { editorState: content }
                });
            } catch (ownerError: any) {
                // Not owner, check collaborator access
            }

            // If not owner, check if user is a collaborator with edit rights
            if (!updated) {
                const { data: collaborators } = await supabaseAdmin
                    .from('document_collaborators')
                    .select('role, user_id')
                    .eq('document_id', id)
                    .eq('user_id', userId)
                    .eq('status', 'accepted')
                    .in('role', ['owner', 'editor']);

                const collaboration = collaborators && collaborators.length > 0 ? collaborators[0] : null;

                if (collaboration) {
                    
                    // Update directly without userId check
                    const { data: jobData, error: updateError } = await supabaseAdmin
                        .from('generation_jobs')
                        .update({
                            result: { editorState: content },
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', id)
                        .select();

                    if (updateError || !jobData || jobData.length === 0) {
                        console.error('❌ Failed to update:', updateError);
                        return res.status(500).json({ status: "error", message: "Failed to save changes", details: updateError?.message });
                    }

                    updated = jobData[0];
                } else {
                    return res.status(403).json({ status: "error", message: "No edit access to this document" });
                }
            }

            return res.json({
                status: "success",
                message: "Generation updated",
                data: updated
            });

        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /ai/generate:
     *   post:
     *     summary: Start a new AI document generation job
     *     tags: [AI]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [prompt]
     *             properties:
     *               prompt:
     *                 type: string
     *                 example: "A pitch deck for a Series A AI startup"
     *               output:
     *                 type: string
     *                 enum: [presentation, document, spreadsheet]
     *                 default: presentation
     *     responses:
     *       200:
     *         description: Job successfully queued
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 message: { type: string }
     *                 data:
     *                   type: object
     *                   properties:
     *                     jobId: { type: string, format: uuid }
     *                     status: { type: string }
     *       400:
     *         description: Invalid input
     *       401:
     *         description: Unauthorized
     */
    private startGeneration = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId; // Extracted from JWT by middleware

            const validation = UserPromptSchema.safeParse({
                ...req.body,
                userId: userId,
                jobId: uuidv4()
            });

            if (!validation.success) {
                return res.status(400).json({ status: "error", message: "Invalid Input", details: validation.error });
            }

            try {
                const job = await this.orchestrator.startGeneration(validation.data.userId, validation.data);

                return res.json({
                    status: "success",
                    message: "Generation Job Queued",
                    data: {
                        jobId: job.id,
                        status: job.status || 'queued'
                    }
                });
            } catch (awsError: any) {
                // If AWS fails, still return success but with warning
                return res.json({
                    status: "success",
                    message: "Job created (AWS SQS unavailable)",
                    data: {
                        jobId: validation.data.jobId,
                        status: 'pending',
                        warning: 'Job created but not queued for processing. Check AWS credentials.'
                    }
                });
            }

        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /ai/status/{id}:
     *   get:
     *     summary: Get the status of a specific generation job
     *     tags: [AI]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *         description: The Job ID
     *     responses:
     *       200:
     *         description: Current job status
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   type: object
     *                   properties:
     *                     id: { type: string }
     *                     status: { type: string, enum: [QUEUED, PROCESSING_INTENT, PROCESSING_LAYOUT, PROCESSING_CONTENT, RENDERING, COMPLETED, FAILED] }
     *                     tokensUsed: { type: number }
     *                     errorMessage: { type: string, nullable: true }
     *       404:
     *         description: Job not found
     */
    private getJobStatus = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            const job = await this.orchestrator.getJobStatus(id, userId);

            if (!job) {
                return res.status(404).json({ status: "error", message: "Job not found" });
            }

            return res.json({
                status: "success",
                data: {
                    id: job.id,
                    status: job.status,
                    tokensUsed: job.tokens_used,
                    errorMessage: job.error_message,
                    result: job.result  // ← ADD THIS! Return the full result including imageUrl
                }
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /ai/generations:
     *   get:
     *     summary: List all generation jobs for the current user
     *     tags: [AI]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of jobs
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id: { type: string }
     *                       prompt: { type: string }
     *                       type: { type: string }
     *                       status: { type: string }
     *                       createdAt: { type: string, format: date-time }
     */
    private getUserGenerations = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            const jobs = await this.orchestrator.getUserJobs(userId);

            return res.json({
                status: "success",
                data: jobs.map(j => ({
                    id: j.id,
                    title: j.title || j.input_data?.title || "Untitled",
                    prompt: j.prompt || j.input_data?.prompt,
                    type: j.type || j.output_type || j.input_data?.output || 'document',  // FIX: Use correct column!
                    status: j.status,
                    createdAt: j.created_at
                }))
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /ai/recent-generations:
     *   get:
     *     summary: List the last 3 generation jobs
     *     tags: [AI]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: List of recent jobs
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string, example: "success" }
     *                 data:
     *                   type: array
     *                   items:
     *                     type: object
     *                     properties:
     *                       id: { type: string }
     *                       title: { type: string }
     *                       coverImage: { type: string }
     *                       type: { type: string }
     *                       status: { type: string }
     *                       createdAt: { type: string, format: date-time }
     *                       prompt: { type: string }
     *                       errorMessage: { type: string }
     *                       tokensUsed: { type: number }
     *                       currentStepData: { type: object }
     *                       finalUrl: { type: string }
     */
    private getRecentGenerations = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            // Allow client to specify limit, default to 3 for home page, or use a high number for "all"
            const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 3;
            const jobs = await this.orchestrator.getRecentJobs(userId, limit);

            // Filter out deleted documents
            const activeJobs = jobs.filter(j => j.status !== 'DELETED');

            return res.json({
                status: "success",
                data: activeJobs.map(j => ({
                    id: j.id,
                    title: j.title || j.input_data?.title || "Untitled",
                    coverImage: j.cover_image || j.input_data?.cover_image,
                    type: j.type || j.output_type || j.input_data?.output || 'document',  // FIX: Use correct column!
                    status: j.status,
                    createdAt: j.created_at,
                    prompt: j.prompt || j.input_data?.prompt,
                    errorMessage: j.error_message || j.error,
                    tokensUsed: j.tokens_used || 0,
                    currentStepData: j.current_step_data,
                    finalUrl: j.final_url
                }))
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * Get recent activity (last accessed/edited documents)
     * Sorts by actual usage (last_seen from collaboration_sessions or updated_at)
     * Returns max 12 items for Recents tab
     */
    private getRecentActivity = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const limit = 12; // Fixed limit for Recents tab

            // Get all documents user has access to (owned + shared)
            const { data: ownedJobs } = await supabaseAdmin
                .from('generation_jobs')
                .select('*')
                .eq('user_id', userId)
                .neq('status', 'DELETED')  // Exclude soft-deleted documents
                .order('updated_at', { ascending: false });

            const { data: sharedCollabs } = await supabaseAdmin
                .from('document_collaborators')
                .select('document_id')
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .neq('role', 'owner');

            const sharedDocIds = (sharedCollabs || []).map(c => c.document_id);
            
            let sharedJobs = [];
            if (sharedDocIds.length > 0) {
                const { data } = await supabaseAdmin
                    .from('generation_jobs')
                    .select('*')
                    .in('id', sharedDocIds)
                    .neq('status', 'DELETED')  // Exclude soft-deleted documents
                    .order('updated_at', { ascending: false });
                sharedJobs = data || [];
            }

            // Combine all documents
            const allDocs = [...(ownedJobs || []), ...sharedJobs];

            // Get last accessed time from collaboration_sessions for each document
            const docsWithLastAccess = await Promise.all(
                allDocs.map(async (doc) => {
                    const { data: session } = await supabaseAdmin
                        .from('collaboration_sessions')
                        .select('last_seen')
                        .eq('document_id', doc.id)
                        .eq('user_id', userId)
                        .order('last_seen', { ascending: false })
                        .limit(1)
                        .single();

                    // Use last_seen if available, otherwise updated_at, fallback to created_at
                    const lastActivityTime = session?.last_seen || doc.updated_at || doc.created_at;

                    return {
                        ...doc,
                        lastActivityTime: new Date(lastActivityTime).getTime(),
                        isShared: sharedDocIds.includes(doc.id)
                    };
                })
            );

            // Sort by last activity (most recent first)
            docsWithLastAccess.sort((a, b) => b.lastActivityTime - a.lastActivityTime);

            // Take top 12
            const recentDocs = docsWithLastAccess.slice(0, limit);

            return res.json({
                status: "success",
                data: recentDocs.map(j => ({
                    id: j.id,
                    title: j.title || j.input_data?.title || "Untitled",
                    coverImage: j.cover_image || j.input_data?.cover_image,
                    type: j.type || j.output_type || j.input_data?.output || 'document',
                    status: j.status,
                    createdAt: j.created_at,
                    updatedAt: j.updated_at,
                    lastAccessed: new Date(j.lastActivityTime).toISOString(),
                    isShared: j.isShared,
                    prompt: j.prompt || j.input_data?.prompt,
                    errorMessage: j.error_message || j.error,
                    tokensUsed: j.tokens_used || 0,
                    currentStepData: j.current_step_data,
                    finalUrl: j.final_url
                }))
            });
        } catch (error) {
            console.error('❌ Get recent activity error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * Pin a document (max 10 pins per user)
     */
    private pinDocument = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { documentId } = req.params;

            // Check if user has access to this document
            const { data: job } = await supabaseAdmin
                .from('generation_jobs')
                .select('id')
                .eq('id', documentId)
                .eq('user_id', userId)
                .single();

            if (!job) {
                // Check if shared
                const { data: collab } = await supabaseAdmin
                    .from('document_collaborators')
                    .select('id')
                    .eq('document_id', documentId)
                    .eq('user_id', userId)
                    .eq('status', 'accepted')
                    .single();

                if (!collab) {
                    return res.status(403).json({ status: "error", message: "No access to this document" });
                }
            }

            // Check pin count (max 10)
            const { count } = await supabaseAdmin
                .from('pinned_documents')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', userId);

            if ((count || 0) >= 10) {
                return res.status(400).json({ status: "error", message: "Maximum 10 pinned documents reached. Unpin a document first." });
            }

            // Pin the document
            const { error } = await supabaseAdmin
                .from('pinned_documents')
                .insert({
                    user_id: userId,
                    document_id: documentId,
                    pinned_at: new Date().toISOString()
                });

            if (error) {
                if (error.code === '23505') {
                    return res.status(400).json({ status: "error", message: "Document already pinned" });
                }
                throw error;
            }

            console.log(`📌 User ${userId} pinned document ${documentId}`);

            return res.json({
                status: "success",
                message: "Document pinned successfully"
            });
        } catch (error) {
            console.error('❌ Pin document error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * Unpin a document
     */
    private unpinDocument = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { documentId } = req.params;

            const { error } = await supabaseAdmin
                .from('pinned_documents')
                .delete()
                .eq('user_id', userId)
                .eq('document_id', documentId);

            if (error) throw error;

            console.log(`📌 User ${userId} unpinned document ${documentId}`);

            return res.json({
                status: "success",
                message: "Document unpinned successfully"
            });
        } catch (error) {
            console.error('❌ Unpin document error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * Get all pinned documents for the user
     */
    private getPinnedDocuments = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get pinned document IDs
            const { data: pins, error: pinsError } = await supabaseAdmin
                .from('pinned_documents')
                .select('document_id, pinned_at')
                .eq('user_id', userId)
                .order('pinned_at', { ascending: false });

            if (pinsError) throw pinsError;

            if (!pins || pins.length === 0) {
                return res.json({
                    status: "success",
                    data: []
                });
            }

            const docIds = pins.map(p => p.document_id);

            // Get document details
            const { data: docs, error: docsError } = await supabaseAdmin
                .from('generation_jobs')
                .select('*')
                .in('id', docIds)
                .neq('status', 'DELETED');  // Exclude soft-deleted documents

            if (docsError) throw docsError;

            // Check which are shared with user
            const { data: sharedCollabs } = await supabaseAdmin
                .from('document_collaborators')
                .select('document_id')
                .eq('user_id', userId)
                .eq('status', 'accepted')
                .neq('role', 'owner')
                .in('document_id', docIds);

            const sharedDocIds = (sharedCollabs || []).map(c => c.document_id);

            // Sort docs by pin order
            const sortedDocs = docIds
                .map(id => docs?.find(d => d.id === id))
                .filter(d => d !== undefined);

            return res.json({
                status: "success",
                data: sortedDocs.map(j => ({
                    id: j.id,
                    title: j.title || j.input_data?.title || "Untitled",
                    coverImage: j.cover_image || j.input_data?.cover_image,
                    type: j.type || j.output_type || j.input_data?.output || 'document',
                    status: j.status,
                    createdAt: j.created_at,
                    updatedAt: j.updated_at,
                    isShared: sharedDocIds.includes(j.id),
                    isPinned: true,
                    prompt: j.prompt || j.input_data?.prompt,
                    errorMessage: j.error_message || j.error,
                    tokensUsed: j.tokens_used || 0,
                    currentStepData: j.current_step_data,
                    finalUrl: j.final_url
                }))
            });
        } catch (error) {
            console.error('❌ Get pinned documents error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * Archive a document
     */
    private archiveDocument = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { documentId } = req.params;

            // Check if user owns or has access to this document
            const { data: job } = await supabaseAdmin
                .from('generation_jobs')
                .select('id, user_id')
                .eq('id', documentId)
                .single();

            if (!job) {
                return res.status(404).json({ status: "error", message: "Document not found" });
            }

            // Check if user is owner or collaborator
            const isOwner = job.user_id === userId;
            let hasAccess = isOwner;

            if (!isOwner) {
                const { data: collab } = await supabaseAdmin
                    .from('document_collaborators')
                    .select('id')
                    .eq('document_id', documentId)
                    .eq('user_id', userId)
                    .eq('status', 'accepted')
                    .single();

                hasAccess = !!collab;
            }

            if (!hasAccess) {
                return res.status(403).json({ status: "error", message: "No access to this document" });
            }

            // Archive the document by updating its status or adding to archived table
            // Option 1: Update generation_jobs table (simpler)
            const { error: updateError } = await supabaseAdmin
                .from('generation_jobs')
                .update({ 
                    status: 'ARCHIVED',
                    updated_at: new Date().toISOString()
                })
                .eq('id', documentId);

            if (updateError) throw updateError;

            console.log(`📦 User ${userId} archived document ${documentId}`);

            return res.json({
                status: "success",
                message: "Document archived successfully"
            });
        } catch (error) {
            console.error('❌ Archive document error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * Unarchive a document
     */
    private unarchiveDocument = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { documentId } = req.params;

            // Check access (same as archive)
            const { data: job } = await supabaseAdmin
                .from('generation_jobs')
                .select('id, user_id')
                .eq('id', documentId)
                .single();

            if (!job) {
                return res.status(404).json({ status: "error", message: "Document not found" });
            }

            const isOwner = job.user_id === userId;
            let hasAccess = isOwner;

            if (!isOwner) {
                const { data: collab } = await supabaseAdmin
                    .from('document_collaborators')
                    .select('id')
                    .eq('document_id', documentId)
                    .eq('user_id', userId)
                    .eq('status', 'accepted')
                    .single();

                hasAccess = !!collab;
            }

            if (!hasAccess) {
                return res.status(403).json({ status: "error", message: "No access to this document" });
            }

            // Restore from archive
            const { error: updateError } = await supabaseAdmin
                .from('generation_jobs')
                .update({ 
                    status: 'COMPLETED',
                    updated_at: new Date().toISOString()
                })
                .eq('id', documentId);

            if (updateError) throw updateError;

            console.log(`📦 User ${userId} unarchived document ${documentId}`);

            return res.json({
                status: "success",
                message: "Document unarchived successfully"
            });
        } catch (error) {
            console.error('❌ Unarchive document error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * Get all archived documents for the user
     */
    private getArchivedDocuments = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get archived documents
            const { data: docs, error: docsError } = await supabaseAdmin
                .from('generation_jobs')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'ARCHIVED')
                .order('updated_at', { ascending: false });

            if (docsError) throw docsError;

            return res.json({
                status: "success",
                data: (docs || []).map(j => ({
                    id: j.id,
                    title: j.title || j.input_data?.title || "Untitled",
                    coverImage: j.cover_image || j.input_data?.cover_image,
                    type: j.type || j.output_type || j.input_data?.output || 'document',
                    status: j.status,
                    createdAt: j.created_at,
                    updatedAt: j.updated_at,
                    isArchived: true,
                    prompt: j.prompt || j.input_data?.prompt,
                    errorMessage: j.error_message || j.error,
                    tokensUsed: j.tokens_used || 0,
                    currentStepData: j.current_step_data,
                    finalUrl: j.final_url
                }))
            });
        } catch (error) {
            console.error('❌ Get archived documents error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * Delete a document (SOFT DELETE)
     * Sets status to 'DELETED' (uses updated_at as deletion timestamp)
     * Does NOT remove from database - can be recovered
     */
    private deleteGeneration = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;

            // Check if user owns this document
            const { data: job } = await supabaseAdmin
                .from('generation_jobs')
                .select('id, user_id, status')
                .eq('id', id)
                .eq('user_id', userId)
                .single();

            if (!job) {
                return res.status(404).json({ 
                    status: "error", 
                    message: "Document not found or you don't have permission to delete it" 
                });
            }

            // Check if already deleted
            if (job.status === 'DELETED') {
                return res.status(400).json({
                    status: "error",
                    message: "Document is already deleted"
                });
            }

            // SOFT DELETE: Update status to DELETED (updated_at becomes deletion timestamp)
            const { error: deleteError } = await supabaseAdmin
                .from('generation_jobs')
                .update({ 
                    status: 'DELETED',
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .eq('user_id', userId);

            if (deleteError) throw deleteError;

            // Remove from pinned_documents (cleanup, but document still exists)
            await supabaseAdmin
                .from('pinned_documents')
                .delete()
                .eq('document_id', id);

            console.log(`🗑️ User ${userId} soft deleted document ${id} (status: DELETED, updated_at as deletion time)`);

            return res.json({
                status: "success",
                message: "Document deleted successfully"
            });
        } catch (error) {
            console.error('❌ Delete document error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * Restore a soft-deleted document
     */
    private restoreDocument = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { documentId } = req.params;

            // Check if user owns this document
            const { data: job } = await supabaseAdmin
                .from('generation_jobs')
                .select('id, user_id, status')
                .eq('id', documentId)
                .eq('user_id', userId)
                .single();

            if (!job) {
                return res.status(404).json({ 
                    status: "error", 
                    message: "Document not found" 
                });
            }

            // Check if it's deleted
            if (job.status !== 'DELETED') {
                return res.status(400).json({
                    status: "error",
                    message: "Document is not deleted"
                });
            }

            // Restore: Set status back to COMPLETED
            const { error: restoreError } = await supabaseAdmin
                .from('generation_jobs')
                .update({ 
                    status: 'COMPLETED',
                    updated_at: new Date().toISOString()
                })
                .eq('id', documentId)
                .eq('user_id', userId);

            if (restoreError) throw restoreError;

            console.log(`♻️ User ${userId} restored document ${documentId}`);

            return res.json({
                status: "success",
                message: "Document restored successfully"
            });
        } catch (error) {
            console.error('❌ Restore document error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * Get all deleted documents (trash bin)
     */
    private getDeletedDocuments = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get deleted documents (sorted by updated_at which is the deletion timestamp)
            const { data: docs, error: docsError } = await supabaseAdmin
                .from('generation_jobs')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'DELETED')
                .order('updated_at', { ascending: false });

            if (docsError) throw docsError;

            return res.json({
                status: "success",
                data: (docs || []).map(j => ({
                    id: j.id,
                    title: j.title || j.input_data?.title || "Untitled",
                    coverImage: j.cover_image || j.input_data?.cover_image,
                    type: j.type || j.output_type || j.input_data?.output || 'document',
                    status: j.status,
                    createdAt: j.created_at,
                    updatedAt: j.updated_at,
                    deletedAt: j.updated_at, // Use updated_at as deletion timestamp
                    isDeleted: true,
                    prompt: j.prompt || j.input_data?.prompt,
                    errorMessage: j.error_message || j.error,
                    tokensUsed: j.tokens_used || 0,
                    currentStepData: j.current_step_data,
                    finalUrl: j.final_url
                }))
            });
        } catch (error) {
            console.error('❌ Get deleted documents error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /ai/generation/{id}:
     *   get:
     *     summary: Get full details of a completed generation
     *     tags: [AI]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *           format: uuid
     *     responses:
     *       200:
     *         description: Full job details including intermediate steps and final output
     *       404:
     *         description: Job not found
     */
    private getGenerationDetails = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const userId = req.user!.userId;

            // Try to get job (owner check)
            let job = await this.orchestrator.getJobStatus(id, userId);

            // If not found, check if user is a collaborator
            if (!job) {
                console.log(`📊 User ${userId} is not owner, checking collaboration access...`);
                
                const { data: collaboration, error: collabError } = await supabaseAdmin
                    .from('document_collaborators')
                    .select('role, status, user_id')
                    .eq('document_id', id)
                    .eq('user_id', userId)
                    .eq('status', 'accepted')
                    .single();

                console.log(`🔍 Collaboration check result:`, { collaboration, collabError });

                if (collaboration) {
                    console.log(` User is collaborator (${collaboration.role}), allowing access`);
                    
                    // Get job without user_id check (collaborator access)
                    const { data: jobData } = await supabaseAdmin
                        .from('generation_jobs')
                        .select('*')
                        .eq('id', id)
                        .single();
                    
                    job = jobData;
                } else {
                    // DEBUG: Show all collaborators for this document
                    const { data: allCollabs } = await supabaseAdmin
                        .from('document_collaborators')
                        .select('user_id, role, status')
                        .eq('document_id', id);
                    
                    console.log(`❌ User not found as collaborator. All collaborators for this doc:`, allCollabs);
                    console.log(`   Looking for user_id: ${userId}`);
                }
            }

            if (!job) {
                return res.status(404).json({ status: "error", message: "Job not found" });
            }

            return res.json({
                status: "success",
                data: job
            });
        } catch (error) {
            console.error('❌ getGenerationDetails error:', error);
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /ai/motivation-quote:
     *   get:
     *     summary: Get a fresh AI-generated motivation quote
     *     tags: [AI]
     *     responses:
     *       200:
     *         description: A motivational quote
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status: { type: string }
     *                 message: { type: string }
     *                 details:
     *                   type: object
     *                   properties:
     *                     quote: { type: string }
     */
    private getMotivationQuote = async (req: Request, res: Response) => {
        try {
            // Try to get from database first (if table exists)
            const dbQuote = await SupabaseDB.getRandomMotivationQuote();

            if (dbQuote && dbQuote.quote) {
                return res.status(200).json({
                    status: "success",
                    message: "Quote retrieved",
                    details: { quote: dbQuote.quote }
                });
            }

            // Generate fresh quote with Claude
            const completion = await this.claude.messages.create({
                model: "claude-sonnet-4-20250514",
                max_tokens: 100,
                temperature: 0.9,
                system: "You generate premium, execution-focused motivational lines for high-performing professionals (agency, marketing, corporate, events). Each quote must be a single flowing sentence, not split into two parts. Ground it in real work (deadlines, decks, revisions, pressure, output). Avoid clichés, generic motivation, or abstract language. Tone is sharp, controlled, and editorial with subtle authority. Output one concise sentence (43–50 characters), ending with a strong verb. No quotation marks.",
                messages: [
                    { role: "user", content: "Generate a daily motivation quote for a professional dashboard." }
                ]
            });

            const textBlock: any = completion.content.find((block: any) => block.type === 'text');
            const content = textBlock?.text?.trim() || "Turn pressure into output. Execute.";

            return res.status(200).json({
                status: "success",
                message: "Quote generated",
                details: { quote: content }
            });

        } catch (error) {
            // Return fallback quote instead of error
            return res.status(200).json({
                status: "success",
                message: "Quote retrieved (fallback)",
                details: { quote: "Turn pressure into output. Execute." }
            });
        }
    }
}
