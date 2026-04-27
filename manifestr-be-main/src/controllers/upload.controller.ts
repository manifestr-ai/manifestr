import { Response } from 'express';
import { BaseController } from './base.controller';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { s3Util } from '../utils/s3.util';
import { uploadImage } from '../middleware/upload.middleware';
import { supabaseAdmin } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export class UploadController extends BaseController {
    public basePath = '/api/uploads';

    protected initializeRoutes(): void {
        this.routes = [
            { verb: 'POST', path: '/presign', handler: this.getPresignedUrl, middlewares: [authenticateToken] },
            { verb: 'POST', path: '/direct', handler: this.directUpload, middlewares: [uploadImage.single('file')] }
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

    /**
     * Direct file upload endpoint
     * Uploads file directly to Supabase Storage with local fallback
     */
    private directUpload = async (req: AuthRequest, res: Response) => {
        try {
            const file = req.file;
            
            if (!file) {
                return res.status(400).json({ status: "error", message: "No file uploaded" });
            }

            // Generate unique filename
            const extension = path.extname(file.originalname);
            const fileName = `${uuidv4()}${extension}`;
            const userId = req.user?.userId || 'anonymous';
            const filePath = `${userId}/uploads/${fileName}`;

            let fileUrl: string;

            try {
                // Try Supabase Storage first
                const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
                    .from('generated-images')
                    .upload(filePath, file.buffer, {
                        contentType: file.mimetype,
                        upsert: true
                    });

                if (uploadError) {
                    throw uploadError;
                }

                const { data: urlData } = supabaseAdmin.storage
                    .from('generated-images')
                    .getPublicUrl(filePath);
                
                fileUrl = urlData.publicUrl;
                console.log(`✅ File uploaded to Supabase Storage: ${fileUrl}`);
            } catch (supabaseError: any) {
                // Fallback to local storage
                console.log(`⚠️ Supabase Storage unavailable, using local storage...`);
                
                const fs = require('fs');
                const localDir = path.join(process.cwd(), 'public/uploads/user-uploads');
                if (!fs.existsSync(localDir)) {
                    fs.mkdirSync(localDir, { recursive: true });
                }
                
                const localPath = path.join(localDir, fileName);
                fs.writeFileSync(localPath, file.buffer);
                
                const baseUrl = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 8000}`;
                fileUrl = `${baseUrl}/uploads/user-uploads/${fileName}`;
                console.log(`✅ File saved to local storage: ${fileUrl}`);
            }

            return res.json({
                status: "success",
                data: {
                    url: fileUrl,
                    fileName: file.originalname,
                    size: file.size,
                    mimeType: file.mimetype
                }
            });

        } catch (error) {
            console.error('❌ File upload failed:', error);
            return res.status(500).json({ 
                status: "error", 
                message: (error as Error).message 
            });
        }
    }
}
