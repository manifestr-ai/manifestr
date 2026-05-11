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
import { UploadController } from './controllers/upload.controller';
import { ImageGeneratorController } from './controllers/image.generator.controller';
import { ImageModifierController } from './controllers/image.modifier.controller';
import { SpreadsheetGeneratorController } from './controllers/spreadsheet.generator.controller';
import { PresentationGeneratorController } from './controllers/presentation.generator.controller';
import { ChartGeneratorController } from './controllers/chart.generator.controller';
import { VaultController } from './controllers/vault.controller';
import { StyleGuideController } from './controllers/style-guide.controller';
import { EarlyAccessController } from './controllers/early-access.controller';
import { CollaborationController } from './controllers/collaboration.controller';
import { CollabProjectsController } from './controllers/collab-projects.controller';
import { AdminController } from './controllers/admin.controller';
import { ThreadsController } from './controllers/threads.controller';
import { UserStatsController } from './controllers/user.stats.controller';
import { AnalyticsApiController } from './controllers/analytics.controller';
import { SubscriptionController } from './controllers/subscription.controller';

const serverStartedAt = new Date();

class App {
    public app: Application;
    public port: number = 31981;

    constructor() {
        this.app = express();
        this.port = Number(process.env.PORT) || this.port;
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeControllers();
        this.initializeErrorHandlers();
        setupSwagger(this.app);
    }

    public listen(cb?: () => void) {
        const server = this.app.listen(this.port, cb);
        
        // 🔥 Set server timeout to 10 minutes for long-running AI requests
        server.timeout = 600000; // 10 minutes in milliseconds
        server.keepAliveTimeout = 605000; // Slightly longer than timeout
        server.headersTimeout = 610000; // Slightly longer than keepAliveTimeout
        
        console.log(`⏱️  Server timeout set to ${server.timeout / 1000} seconds`);
        
        return server;
    }

    private initializeMiddlewares() {
        // Configure CORS with proper production support
        const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS
            ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
            : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', `http://localhost:${this.port}`];

        console.log('🔒 CORS allowed origins:', allowedOrigins);

        this.app.use(
            cors({
                origin: (origin, callback) => {
                    // Allow requests with no origin (like mobile apps or curl requests)
                    if (!origin) {
                        return callback(null, true);
                    }

                    // Check if origin is in allowed list
                    if (allowedOrigins.indexOf(origin) !== -1) {
                        callback(null, true);
                    } else {
                        // In development, allow all origins
                        // In production, you should set CORS_ALLOWED_ORIGINS in .env
                        callback(null, true);
                    }
                },
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
                allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
                exposedHeaders: ['Content-Length', 'X-Request-Id'],
                maxAge: 86400, // 24 hours
            })
        );

        // Explicit OPTIONS handler for preflight requests
        this.app.options('*', cors());

        // Increase body size limits for large base64 images
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(express.urlencoded({ limit: '100mb', extended: true }));
        this.app.use(cookieParser());

        // ─────────────────────────────────────────────────────────────
        // LOCAL FILE STORAGE (Replaces S3)
        // ─────────────────────────────────────────────────────────────
        
        // 1. Serve static files (GET) with CORS headers for images
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Add CORS headers for static files
        this.app.use('/uploads', (req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        }, express.static(uploadDir));

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
            new ImageModifierController(),
            new SpreadsheetGeneratorController(),
            new PresentationGeneratorController(),
            new ChartGeneratorController(),
            new AIController(),
            new UploadController(),
            new VaultController(),
            new StyleGuideController(),
            new EarlyAccessController(),
            new AdminController(),
            new CollaborationController(), // Real-time collaboration
            new CollabProjectsController(), // Collab projects/folders
            new ThreadsController(), // NEW: Threaded commenting/feedback system
            new UserStatsController(), // User statistics and achievements
            new AnalyticsApiController(), // Client analytics (/analytics/track)
            new SubscriptionController(), // Stripe subscription management
        ];

        controllers.forEach((controller) => {
            this.app.use(controller.basePath, controller.Router());
        });
    }

    private initializeErrorHandlers() {
        // Global error handler for body parser errors (413, etc.)
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            // Ensure CORS headers are present even on errors
            const origin = req.headers.origin;
            if (origin) {
                res.setHeader('Access-Control-Allow-Origin', origin);
                res.setHeader('Access-Control-Allow-Credentials', 'true');
            }

            if (err.type === 'entity.too.large' || err.status === 413) {
                console.error('❌ 413 Error: Request body too large', {
                    limit: err.limit,
                    length: err.length,
                    path: req.path
                });
                return res.status(413).json({
                    error: 'Request body too large',
                    details: 'The image is too large to upload. Please try with a smaller image or reduce the quality.',
                    maxSize: '100MB'
                });
            }

            // Pass to next error handler if not a body size error
            next(err);
        });

        // Final catch-all error handler
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error('❌ Unhandled error:', err);
            
            // Ensure CORS headers
            const origin = req.headers.origin;
            if (origin) {
                res.setHeader('Access-Control-Allow-Origin', origin);
                res.setHeader('Access-Control-Allow-Credentials', 'true');
            }

            res.status(err.status || 500).json({
                error: 'Internal server error',
                details: err.message || 'Unknown error'
            });
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
                        supabase: 'connected',
                        process_uptime_seconds: Math.floor(process.uptime()),
                        server_started_at: serverStartedAt.toISOString(),
                        now: new Date().toISOString(),
                    },
                });
            } catch (error) {
                return res.status(503).json({
                    status: 'error',
                    message: 'Database connection error',
                    details: {
                        error: error instanceof Error ? error.message : 'Unknown error',
                        process_uptime_seconds: Math.floor(process.uptime()),
                        server_started_at: serverStartedAt.toISOString(),
                        now: new Date().toISOString(),
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
