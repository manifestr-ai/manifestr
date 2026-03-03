import { Response } from 'express';
import { BaseController } from './base.controller';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import SupabaseDB from '../lib/supabase-db';
import { s3Util } from '../utils/s3.util';
import { validate as uuidValidate } from 'uuid';

export class VaultController extends BaseController {
    public basePath = '/api/vaults';

    protected initializeRoutes(): void {
        this.routes = [
            { verb: 'GET', path: '/', handler: this.listItems, middlewares: [authenticateToken] },
            { verb: 'POST', path: '/', handler: this.createItem, middlewares: [authenticateToken] },
            { verb: 'POST', path: '/folder', handler: this.createFolder, middlewares: [authenticateToken] },
            { verb: 'PATCH', path: ('/:id'), handler: this.updateItem, middlewares: [authenticateToken] },
            { verb: 'DELETE', path: '/:id', handler: this.deleteItem, middlewares: [authenticateToken] }
        ];
    }

    /**
     * @swagger
     * /vaults:
     *   get:
     *     summary: List vault items
     *     tags: [Vaults]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: parentId
     *         schema: { type: string }
     *         description: Filter by parent folder ID (use 'root' or omit for top-level)
     *       - in: query
     *         name: search
     *         schema: { type: string }
     *         description: Search by title
     *     responses:
     *       200:
     *         description: List of items
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private listItems = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { parentId, search } = req.query;

            // Get all user's vault items
            let items = await SupabaseDB.getUserVaultItems(userId);

            // Filter by search
            if (search) {
                items = items.filter(item =>
                    item.title.toLowerCase().includes((search as string).toLowerCase())
                );
            } else if (parentId && parentId !== 'root') {
                if (!uuidValidate(parentId as string)) {
                    return res.status(400).json({ status: "error", message: "Invalid parentId" });
                }
                items = items.filter(item => item.parent_id === parentId);
            } else {
                // Root items only
                items = items.filter(item => !item.parent_id);
            }

            // Sort: folders first, then by title
            items.sort((a, b) => {
                if (a.type !== b.type) {
                    return a.type === 'folder' ? -1 : 1;
                }
                return a.title.localeCompare(b.title);
            });

            return res.json({
                status: "success",
                data: items,
                meta: { total: items.length }
            });
        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /vaults:
     *   post:
     *     summary: Create a new file item
     *     tags: [Vaults]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [title, fileKey]
     *             properties:
     *               title: { type: string }
     *               fileKey: { type: string }
     *               parentId: { type: string }
     *               status: { type: string, enum: [Draft, In Progress, In Review, Final] }
     *               project: { type: string }
     *               size: { type: number }
     *               thumbnailUrl: { type: string }
     *     responses:
     *       201:
     *         description: Item created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private createItem = async (req: AuthRequest, res: Response) => {
        try {

            const userId = req.user!.userId;
            const { title, fileKey, parentId, status, project, size, thumbnailUrl } = req.body;

            if (!title || !fileKey) {
                return res.status(400).json({ status: "error", message: "Title and fileKey are required" });
            }

            let validatedParentId = parentId;
            if (parentId === 'root') {
                validatedParentId = null;
            } else if (parentId && !uuidValidate(parentId)) {
                return res.status(400).json({ status: "error", message: "Invalid parentId" });
            }

            // Create vault item using Supabase
            const newItem = await SupabaseDB.createVaultItem(userId, {
                title,
                type: 'file',
                file_key: fileKey,
                parent_id: validatedParentId,
                status: status || 'Draft',
                project,
                size,
                thumbnail_url: thumbnailUrl
            });

            return res.status(201).json({ status: "success", data: newItem });

        } catch (error: any) {
            if (error.code === '23503') {
                return res.status(400).json({ status: "error", message: "User not found or Invalid References" });
            }
            return res.status(500).json({ status: "error", message: error.message });
        }
    }

    /**
     * @swagger
     * /vaults/folder:
     *   post:
     *     summary: Create a new folder
     *     tags: [Vaults]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [title]
     *             properties:
     *               title: { type: string }
     *               parentId: { type: string }
     *               project: { type: string }
     *     responses:
     *       201:
     *         description: Folder created
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private createFolder = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { title, parentId, project } = req.body;

            if (!title) {
                return res.status(400).json({ status: "error", message: "Title is required" });
            }

            let validatedParentId = parentId;
            if (parentId === 'root') {
                validatedParentId = null;
            } else if (parentId && !uuidValidate(parentId)) {
                return res.status(400).json({ status: "error", message: "Invalid parentId" });
            }

            // Create folder using Supabase
            const newItem = await SupabaseDB.createVaultItem(userId, {
                title,
                type: 'folder',
                parent_id: validatedParentId,
                status: 'Draft',
                project
            });

            return res.status(201).json({ status: "success", data: newItem });

        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /vaults/{id}:
     *   patch:
     *     summary: Update an item
     *     tags: [Vaults]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *     requestBody:
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               title: { type: string }
     *               status: { type: string }
     *               parentId: { type: string }
     *     responses:
     *       200:
     *         description: Item updated
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private updateItem = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;
            const { title, status, parentId } = req.body;

            // Check if item exists
            const item = await SupabaseDB.getVaultItemById(id, userId);
            if (!item) return res.status(404).json({ status: "error", message: "Item not found" });

            // Build updates object
            const updates: any = {};
            if (title) updates.title = title;
            if (status) updates.status = status;

            if (parentId !== undefined) {
                if (parentId === 'root' || parentId === null) {
                    updates.parent_id = null;
                } else {
                    if (!uuidValidate(parentId)) {
                        return res.status(400).json({ status: "error", message: "Invalid parentId" });
                    }
                    updates.parent_id = parentId;
                }
            }

            // Update using Supabase
            const updatedItem = await SupabaseDB.updateVaultItem(id, userId, updates);
            return res.json({ status: "success", data: updatedItem });

        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }

    /**
     * @swagger
     * /vaults/{id}:
     *   delete:
     *     summary: Delete an item
     *     tags: [Vaults]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema: { type: string }
     *     responses:
     *       200:
     *         description: Item deleted
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/ApiResponse'
     */
    private deleteItem = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { id } = req.params;

            // Get item using Supabase
            const item = await SupabaseDB.getVaultItemById(id, userId);
            if (!item) return res.status(404).json({ status: "error", message: "Item not found" });

            // If it's a file, delete from S3
            if (item.type === 'file' && item.file_key) {
                try {
                    await s3Util.deleteFile(item.file_key);
                } catch (e) {
                }
            }

            // Delete using Supabase (CASCADE will handle children if folder)
            await SupabaseDB.deleteVaultItem(id, userId);
            return res.json({ status: "success", message: "Item deleted" });

        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }
}
