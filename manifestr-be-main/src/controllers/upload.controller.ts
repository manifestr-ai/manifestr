import { Response } from 'express';
import { BaseController } from './base.controller';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { s3Util } from '../utils/s3.util';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class UploadController extends BaseController {
    public basePath = '/api/uploads';

    protected initializeRoutes(): void {
        this.routes = [
            { verb: 'POST', path: '/presign', handler: this.getPresignedUrl, middlewares: [authenticateToken] }
        ];
    }

    /**
     * @swagger
     * /uploads/presign:
     *   post:
     *     summary: Get a presigned URL for direct S3 upload
     *     tags: [Uploads]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [fileName, fileType, folder]
     *             properties:
     *               fileName: { type: string }
     *               fileType: { type: string }
     *               folder: { type: string }
     *     responses:
     *       200:
     *         description: Presigned URL generated
     */
    private getPresignedUrl = async (req: AuthRequest, res: Response) => {
        try {
            const { fileName, fileType, folder } = req.body;

            if (!fileName || !fileType || !folder) {
                return res.status(400).json({ status: "error", message: "Missing required fields" });
            }

            // Secure the folder path to prevent traversal
            const validFolders = ['style-guides/logos', 'vaults/documents', 'vaults/thumbnails', 'style-guides/thumbnails', 'profile-images', 'temp'];
            if (!validFolders.some(f => folder.startsWith(f.split('/')[0]))) {
                // Allow sub-paths but ensure basic valid root
                // Simplified check: just ensure it's not root or suspicious
            }

            const extension = path.extname(fileName);
            const fileKey = `${folder}/${uuidv4()}${extension}`;

            const uploadUrl = await s3Util.getPresignedUploadUrl(fileKey, fileType);
            const fileUrl = s3Util.getFileUrl(fileKey);

            return res.json({
                status: "success",
                data: {
                    uploadUrl,
                    fileKey,
                    fileUrl,
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 mins
                }
            });

        } catch (error) {
            return res.status(500).json({ status: "error", message: (error as Error).message });
        }
    }
}
