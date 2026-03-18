import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { setupSwagger } from './lib/swagger';
import { supabaseAdmin } from './lib/supabase';
import { BaseController } from './controllers/base.controller';
import { AuthController } from './controllers/auth.controller';
import { AIController } from './controllers/ai.controller';
import { DocumentGeneratorController } from './controllers/document.generator.controller';
import { ImageGeneratorController } from './controllers/image.generator.controller';
import { UploadController } from './controllers/upload.controller';
import { VaultController } from './controllers/vault.controller';
import { StyleGuideController } from './controllers/style-guide.controller';
import { EarlyAccessController } from './controllers/early-access.controller';

class App {
    public app: Application;
    public port: number = 31981;

    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT) || this.port;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeControllers();
        setupSwagger(this.app);
    }

    public listen(cb?: () => void) {
        this.app.listen(this.port, cb);
    }

    private initializeMiddlewares() {
        // Configure CORS
        const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
            ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
            : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', `http://localhost:${this.port}`];

        this.app.use(
            cors({
                origin: (origin, callback) => {
                    // Allow requests with no origin (like mobile apps or curl requests)
                    if (!origin) return callback(null, true);

                    if (allowedOrigins.indexOf(origin) !== -1) {
                        callback(null, true);
                    } else {
                        // For development, you might want to allow all:
                        callback(null, true);
                        // callback(new Error('Not allowed by CORS'));
                    }
                },
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
                allowedHeaders: ['Content-Type', 'Authorization'],
            })
        );

        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ limit: '50mb', extended: true }));
        this.app.use(cookieParser());

        // ─────────────────────────────────────────────────────────────
        // LOCAL FILE STORAGE (Replaces S3)
        // ─────────────────────────────────────────────────────────────
        
        // 1. Serve static files (GET)
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        this.app.use('/uploads', express.static(uploadDir));

        // 2. Handle direct uploads (PUT) - mimics S3 presigned URL upload
        this.app.put('/uploads/*', (req, res) => {
            const key = (req.params as any)[0]; // The wildcard part after /uploads/
            if (!key) return res.status(400).send('Missing file key');

            const filePath = path.join(uploadDir, key);
            
            // Ensure directory exists for nested keys
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            // Stream request body to file
            const fileStream = fs.createWriteStream(filePath);
            req.pipe(fileStream);

            fileStream.on('finish', () => {
                res.status(200).send('Uploaded successfully');
            });

            fileStream.on('error', (err) => {
                console.error('Upload error:', err);
                res.status(500).send('Upload failed');
            });
        });
    }

    private initializeControllers() {
        const controllers: BaseController[] = [
            new AuthController(),
            new DocumentGeneratorController(),
            new ImageGeneratorController(),
            new AIController(),
            new UploadController(),
            new VaultController(),
            new StyleGuideController(),
            new EarlyAccessController(),
        ];

        controllers.forEach((controller) => {
            this.app.use(controller.basePath, controller.Router());
        });
    }

    private initializeRoutes() {
        /**
         * @openapi
         * /health:
         *   get:
         *     tags: [Health]
         *     summary: Health check endpoint
         *     description: Returns the health status of the application and database connection
         *     responses:
         *       200:
         *         description: Application is healthy and database is connected
         *       503:
         *         description: Application is unhealthy or database is not connected
         */
        this.app.get('/health', async (req: Request, res: Response) => {
            try {
                // Test Supabase connection
                const { data, error } = await supabaseAdmin
                    .from('users')
                    .select('count')
                    .limit(1);

                if (error) throw error;

                return res.json({
                    status: 'success',
                    message: 'Application is healthy',
                    details: {
                        database: 'connected',
                        supabase: 'connected'
                    },
                });
            } catch (error) {
                return res.status(503).json({
                    status: 'error',
                    message: 'Database connection error',
                    details: {
                        error: error instanceof Error ? error.message : 'Unknown error',
                    },
                });
            }
        });

        this.app.get('/', (req: Request, res: Response) => {
            res.send('Manifestr API is running');
        });
    }
}

export default App;
