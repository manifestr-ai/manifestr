import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import SupabaseDB from '../lib/supabase-db';

interface ApiResponse {
    status: "success" | "error";
    message: string;
    details: any;
}

export class EarlyAccessController extends BaseController {
    public basePath = '/early-access';

    protected initializeRoutes(): void {
        /**
         * @openapi
         * /early-access/register:
         *   post:
         *     tags: [Early Access]
         *     summary: Register for early access
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [first_name, last_name, email]
         *             properties:
         *               first_name: { type: string }
         *               last_name: { type: string }
         *               email: { type: string, format: email }
         *     responses:
         *       201:
         *         description: Successfully registered for early access
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ApiResponse'
         *       400:
         *         description: Missing required fields or invalid email
         *       409:
         *         description: Email already registered for early access
         */
        this.routes = [
            { verb: 'POST', path: '/register', handler: this.register },
            { verb: 'GET', path: '/list', handler: this.list },
        ];
    }

    private sendResponse(res: Response, statusCode: number, status: "success" | "error", message: string, details: any = null) {
        const response: ApiResponse = { status, message, details };
        return res.status(statusCode).json(response);
    }

    private register = async (req: Request, res: Response) => {
        try {
            const { first_name, last_name, email } = req.body;

            // Validate required fields
            if (!first_name || !last_name || !email) {
                return this.sendResponse(res, 400, 'error', 'Missing required fields: first_name, last_name, and email are required');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return this.sendResponse(res, 400, 'error', 'Invalid email format');
            }

            // Check if email already exists
            const existingEntry = await SupabaseDB.getEarlyAccessByEmail(email);
            if (existingEntry) {
                return this.sendResponse(res, 409, 'error', 'This email is already registered for early access', {
                    registered_at: existingEntry.created_at
                });
            }

            // Create new early access entry using Supabase
            const earlyAccessEntry = await SupabaseDB.createEarlyAccess({
                first_name,
                last_name,
                email
            });


            return this.sendResponse(res, 201, 'success', 'Successfully registered for early access! We will notify you when access is available.', {
                id: earlyAccessEntry.id,
                first_name: earlyAccessEntry.first_name,
                last_name: earlyAccessEntry.last_name,
                email: earlyAccessEntry.email,
                registered_at: earlyAccessEntry.created_at
            });

        } catch (error) {
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private list = async (req: Request, res: Response) => {
        try {
            // Get all early access registrations using Supabase
            const entries = await SupabaseDB.listEarlyAccess();

            return this.sendResponse(res, 200, 'success', 'Early access registrations retrieved successfully', {
                total: entries?.length || 0,
                registrations: entries || []
            });

        } catch (error) {
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };
}

