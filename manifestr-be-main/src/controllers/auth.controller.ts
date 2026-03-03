import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { supabaseAdmin, supabase } from '../lib/supabase';
import SupabaseDB from '../lib/supabase-db';

interface ApiResponse {
    status: "success" | "error";
    message: string;
    details: any;
}

export class AuthController extends BaseController {
    public basePath = '/auth';

    protected initializeRoutes(): void {
        /**
         * @openapi
         * /auth/signup:
         *   post:
         *     tags: [Auth]
         *     summary: Register a new user with email verification
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [email, password, first_name, last_name]
         *             properties:
         *               email: { type: string, format: email }
         *               password: { type: string, minLength: 8 }
         *               first_name: { type: string }
         *               last_name: { type: string }
         *               dob: { type: string, format: date }
         *               country: { type: string }
         *               gender: { type: string }
         *               promotional_emails: { type: boolean }
         *     responses:
         *       201:
         *         description: User created successfully, verification email sent
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ApiResponse'
         *       400:
         *         description: Missing required fields
         *       409:
         *         description: User already exists
         * 
         * /auth/login:
         *   post:
         *     tags: [Auth]
         *     summary: Log in with email and password
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [email, password]
         *             properties:
         *               email: { type: string, format: email }
         *               password: { type: string }
         *     responses:
         *       200:
         *         description: Login successful
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ApiResponse'
         *       401:
         *         description: Invalid credentials or email not verified
         * 
         * /auth/refresh-token:
         *   post:
         *     tags: [Auth]
         *     summary: Refresh access token
         *     requestBody:
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             properties:
         *               refreshToken: { type: string }
         *     responses:
         *       200:
         *         description: Token refreshed
         *       401:
         *         description: No token provided
         *       403:
         *         description: Invalid or expired token
         * 
         * /auth/verify-email:
         *   post:
         *     tags: [Auth]
         *     summary: Verify email with token from email link
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [token]
         *             properties:
         *               token: { type: string }
         *               type: { type: string }
         *     responses:
         *       200:
         *         description: Email verified successfully
         *       400:
         *         description: Invalid or expired token
         * 
         * /auth/resend-verification:
         *   post:
         *     tags: [Auth]
         *     summary: Resend verification email
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [email]
         *             properties:
         *               email: { type: string, format: email }
         *     responses:
         *       200:
         *         description: Verification email sent
         * 
         * /auth/onboarding:
         *   post:
         *     tags: [Auth]
         *     summary: Submit user onboarding details
         *     security:
         *       - bearerAuth: []
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             type: object
         *             required: [expertise, job_title, industry, goal, work_style, problems]
         *             properties:
         *               expertise: { type: string }
         *               job_title: { type: string }
         *               industry: { type: string }
         *               goal: { type: string, description: "Comma separated values" }
         *               work_style: { type: string, enum: [Team, Solo] }
         *               problems: { type: string, description: "Comma separated values" }
         *     responses:
         *       200:
         *         description: Onboarding completed
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ApiResponse'
         * 
         * /auth/me:
         *   get:
         *     tags: [Auth]
         *     summary: Get current user profile
         *     security:
         *       - bearerAuth: []
         *     responses:
         *       200:
         *         description: User profile
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/ApiResponse'
         */
        this.routes = [
            { verb: 'POST', path: '/signup', handler: this.signup },
            { verb: 'POST', path: '/login', handler: this.login },
            { verb: 'POST', path: '/refresh-token', handler: this.refreshToken },
            { verb: 'POST', path: '/verify-email', handler: this.verifyEmail },
            { verb: 'POST', path: '/resend-verification', handler: this.resendVerification },
            { verb: 'POST', path: '/onboarding', handler: this.submitOnboarding },
            { verb: 'GET', path: '/me', handler: this.getMe },
        ];
    }

    private sendResponse(res: Response, statusCode: number, status: "success" | "error", message: string, details: any = null) {
        const response: ApiResponse = { status, message, details };
        return res.status(statusCode).json(response);
    }

    private signup = async (req: Request, res: Response) => {
        try {
            const { email, password, first_name, last_name, dob, country, gender, promotional_emails } = req.body;

            if (!email || !password || !first_name || !last_name) {
                return this.sendResponse(res, 400, 'error', 'Missing required fields');
            }

            // Use admin.createUser with email_confirm: true to skip verification!
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true, // AUTO-CONFIRM EMAIL - No verification needed!
                user_metadata: {
                    first_name,
                    last_name,
                    dob,
                    country,
                    gender,
                    promotional_emails
                }
            });


            // const { data: authData, error: authError } = await supabase.auth.signUp({
            //     email,
            //     password,
            //     options: {
            //         data: {
            //             first_name,
            //             last_name,
            //             dob,
            //             country,
            //             gender,
            //             promotional_emails
            //         },
            //         emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email`
            //     }
            // });


            if (authError) {
                if (authError.message.includes('already registered') || authError.message.includes('already been registered')) {
                    return this.sendResponse(res, 409, 'error', 'User already exists');
                }
                return this.sendResponse(res, 400, 'error', authError.message);
            }

            if (!authData.user) {
                return this.sendResponse(res, 400, 'error', 'Failed to create user');
            }


            // Create user record in our database using Supabase
            const user = await SupabaseDB.createUser({
                id: authData.user.id,
                email,
                first_name,
                last_name,
                dob,
                country,
                gender,
                promotional_emails
            });

            // Now sign them in to get tokens
            const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.signInWithPassword({
                email,
                password
            });

            if (sessionError || !sessionData.session) {
                // User created but login failed - return success anyway
                return this.sendResponse(res, 201, 'success', 'Account created! Please log in.', {
                    user: this.sanitizeUser(user),
                    requiresVerification: false
                });
            }


            return this.sendResponse(res, 201, 'success', 'Account created and logged in successfully!', {
                user: this.sanitizeUser(user),
                accessToken: sessionData.session.access_token,
                refreshToken: sessionData.session.refresh_token,
                requiresVerification: false
            });

        } catch (error) {
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return this.sendResponse(res, 400, 'error', 'Email and password are required');
            }

            // Authenticate with Supabase
            const { data, error } = await supabaseAdmin.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return this.sendResponse(res, 401, 'error', 'Invalid credentials');
            }

            // Check if email is verified
            if (!data.user.email_confirmed_at) {
                return this.sendResponse(res, 401, 'error', 'Please verify your email before logging in');
            }

            // Fetch user from our database using Supabase
            let user = await SupabaseDB.getUserById(data.user.id);

            // If user doesn't exist in our DB, create it
            if (!user) {
                user = await SupabaseDB.createUser({
                    id: data.user.id,
                    email: data.user.email!,
                    first_name: data.user.user_metadata?.first_name || 'User',
                    last_name: data.user.user_metadata?.last_name || ''
                });
            } else {
                // Update email verification status
                user = await SupabaseDB.updateUser(data.user.id, { email_verified: true });
            }

            return this.sendResponse(res, 200, 'success', 'Login successful', {
                user: this.sanitizeUser(user),
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token
            });

        } catch (error) {
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private refreshToken = async (req: Request, res: Response) => {
        try {
            const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

            if (!refreshToken) {
                return this.sendResponse(res, 401, 'error', 'No refresh token provided');
            }

            // Refresh the session with Supabase
            const { data, error } = await supabaseAdmin.auth.refreshSession({ refresh_token: refreshToken });

            if (error || !data.session) {
                return this.sendResponse(res, 403, 'error', 'Invalid or expired refresh token');
            }

            return this.sendResponse(res, 200, 'success', 'Token refreshed', {
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token
            });

        } catch (error) {
            return this.sendResponse(res, 500, 'error', 'Internal server error');
        }
    };

    private verifyEmail = async (req: Request, res: Response) => {
        try {
            const { token, type } = req.body;

            if (!token) {
                return this.sendResponse(res, 400, 'error', 'Verification token is required');
            }

            // Verify the token with Supabase
            const { data, error } = await supabaseAdmin.auth.verifyOtp({
                token_hash: token,
                type: type || 'signup'
            });

            if (error || !data.user) {
                return this.sendResponse(res, 400, 'error', 'Invalid or expired verification token');
            }

            // Update user in our database using Supabase
            let user = null;
            try {
                user = await SupabaseDB.getUserById(data.user.id);
                if (user) {
                    user = await SupabaseDB.updateUser(data.user.id, { email_verified: true });
                }
            } catch (err) {
                // User might not exist yet
            }

            return this.sendResponse(res, 200, 'success', 'Email verified successfully', {
                user: user ? this.sanitizeUser(user) : null,
                accessToken: data.session?.access_token,
                refreshToken: data.session?.refresh_token
            });

        } catch (error) {
            return this.sendResponse(res, 500, 'error', 'Internal server error');
        }
    };

    private resendVerification = async (req: Request, res: Response) => {
        try {
            const { email } = req.body;

            if (!email) {
                return this.sendResponse(res, 400, 'error', 'Email is required');
            }

            // Use resend to trigger email automatically
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email,
                options: {
                    emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email`
                }
            });

            if (error) {
                // Don't reveal if user exists or not for security
                return this.sendResponse(res, 200, 'success', 'If an account exists with this email, a verification email has been sent');
            }


            return this.sendResponse(res, 200, 'success', 'Verification email sent successfully');

        } catch (error) {
            return this.sendResponse(res, 500, 'error', 'Internal server error');
        }
    };

    private submitOnboarding = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) return this.sendResponse(res, 401, 'error', 'Unauthorized');

            const token = authHeader.split(' ')[1];

            // Verify token with Supabase
            const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

            if (error || !supabaseUser) {
                return this.sendResponse(res, 401, 'error', 'Unauthorized or invalid token');
            }

            const { expertise, job_title, industry, goal, work_style, problems } = req.body;

            if (!expertise || !job_title || !industry || !goal || !work_style || !problems) {
                return this.sendResponse(res, 400, 'error', 'Missing required fields');
            }

            // Update user using Supabase
            let user = await SupabaseDB.getUserById(supabaseUser.id);

            if (!user) return this.sendResponse(res, 404, 'error', 'User not found');

            user = await SupabaseDB.updateUser(supabaseUser.id, {
                expertise,
                job_title,
                industry,
                goal,
                work_style,
                problems,
                onboarding_completed: true
            });

            return this.sendResponse(res, 200, 'success', 'Onboarding completed', { user: this.sanitizeUser(user) });

        } catch (error) {
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private getMe = async (req: Request, res: Response) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) return this.sendResponse(res, 401, 'error', 'Unauthorized');

            const token = authHeader.split(' ')[1];

            // Verify token with Supabase
            const { data: { user: supabaseUser }, error } = await supabaseAdmin.auth.getUser(token);

            if (error || !supabaseUser) {
                return this.sendResponse(res, 401, 'error', 'Unauthorized or invalid token');
            }

            // Get user using Supabase
            const user = await SupabaseDB.getUserById(supabaseUser.id);

            if (!user) return this.sendResponse(res, 404, 'error', 'User not found');

            return this.sendResponse(res, 200, 'success', 'User profile retrieved', { user: this.sanitizeUser(user) });

        } catch (error) {
            return this.sendResponse(res, 401, 'error', 'Unauthorized or invalid token');
        }
    };

    private sanitizeUser(user: any) {
        // Remove sensitive fields
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }
}
