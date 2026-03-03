import fs from 'fs';
import path from 'path';

export class S3Util {
    private uploadDir: string;
    private baseUrl: string;

    constructor() {
        // Local storage directory
        this.uploadDir = path.join(process.cwd(), 'public/uploads');
        // Ensure directory exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
        
        // Base URL for accessing files
        const port = process.env.PORT || 31981;
        // In production, this should be the public domain
        this.baseUrl = process.env.PUBLIC_URL || `http://localhost:${port}/uploads`;
    }

    /**
     * Returns a URL that the client can PUT to for uploading.
     * In local mode, this points to our own server's PUT endpoint.
     */
    async getPresignedUploadUrl(key: string, contentType: string, expiresInSeconds: number = 900): Promise<string> {
        // Return a local URL that the client can PUT to
        // We need to ensure the key is URL encoded if needed, but usually it's a path
        return `${this.baseUrl}/${key}`;
    }

    /**
     * Get the full URL for a file key
     */
    getFileUrl(key: string): string {
        return `${this.baseUrl}/${key}`;
    }

    async deleteFile(key: string): Promise<void> {
        const filePath = path.join(this.uploadDir, key);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    async uploadFile(key: string, body: string | Buffer, contentType: string): Promise<void> {
        const filePath = path.join(this.uploadDir, key);
        
        // Ensure directory exists for nested keys (e.g. vaults/generations/...)
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, body);
    }
}

// Keep generic instance
export const s3Util = new S3Util();
