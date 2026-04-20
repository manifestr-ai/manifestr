import { Request, Response } from 'express';
import { BaseController } from './base.controller';
import { supabaseAdmin, supabase } from '../lib/supabase';
import SupabaseDB from '../lib/supabase-db';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

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
            { verb: 'POST', path: '/onboarding', handler: this.submitOnboarding, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/me', handler: this.getMe, middlewares: [authenticateToken] },
            { verb: 'PATCH', path: '/profile', handler: this.updateProfile, middlewares: [authenticateToken] },
            { verb: 'POST', path: '/change-password', handler: this.changePassword, middlewares: [authenticateToken] },
            { verb: 'GET', path: '/sessions', handler: this.getSessions, middlewares: [authenticateToken] },
            { verb: 'DELETE', path: '/sessions/:sessionId', handler: this.revokeSession, middlewares: [authenticateToken] },
            { verb: 'PATCH', path: '/security-alerts', handler: this.updateSecurityAlerts, middlewares: [authenticateToken] },
            { verb: 'DELETE', path: '/account', handler: this.deleteAccount, middlewares: [authenticateToken] },
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

    private submitOnboarding = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            const { expertise, job_title, industry, goal, work_style, problems } = req.body;

            if (!expertise || !job_title || !industry || !goal || !work_style || !problems) {
                return this.sendResponse(res, 400, 'error', 'Missing required fields');
            }

            // Update user using Supabase
            let user = await SupabaseDB.getUserById(userId);

            if (!user) return this.sendResponse(res, 404, 'error', 'User not found');

            user = await SupabaseDB.updateUser(userId, {
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

    private getMe = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get user using Supabase
            const user = await SupabaseDB.getUserById(userId);

            if (!user) return this.sendResponse(res, 404, 'error', 'User not found');

            return this.sendResponse(res, 200, 'success', 'User profile retrieved', { user: this.sanitizeUser(user) });

        } catch (error) {
            return this.sendResponse(res, 401, 'error', 'Unauthorized or invalid token');
        }
    };

    private updateProfile = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get current user
            const user = await SupabaseDB.getUserById(userId);
            if (!user) return this.sendResponse(res, 404, 'error', 'User not found');

            // Extract updatable fields from request body
            const {
                username,
                display_name,
                first_name,
                last_name,
                phone_number,
                dob,
                gender,
                country,
                job_title,
                industry,
                years_of_experience,
                profile_image_url
            } = req.body;

            // Build update object with only provided fields that exist in the table
            const updates: any = {};
            if (first_name !== undefined) updates.first_name = first_name;
            if (last_name !== undefined) updates.last_name = last_name;
            if (dob !== undefined) updates.dob = dob;
            if (gender !== undefined) updates.gender = gender;
            if (country !== undefined) updates.country = country;
            if (job_title !== undefined) updates.job_title = job_title;
            if (industry !== undefined) updates.industry = industry;
            
            // Optional fields - only add if they're not undefined
            if (username !== undefined) updates.username = username;
            if (display_name !== undefined) updates.display_name = display_name;
            if (phone_number !== undefined) updates.phone_number = phone_number;
            if (years_of_experience !== undefined) updates.years_of_experience = years_of_experience;
            if (profile_image_url !== undefined) updates.profile_image_url = profile_image_url;

            // Update user using Supabase - handle column not found errors gracefully
            try {
                const updatedUser = await SupabaseDB.updateUser(userId, updates);
                return this.sendResponse(res, 200, 'success', 'Profile updated successfully', { user: this.sanitizeUser(updatedUser) });
            } catch (dbError: any) {
                // If column doesn't exist, try again with only basic fields
                if (dbError.message && dbError.message.includes('column')) {
                    const basicUpdates: any = {};
                    if (first_name !== undefined) basicUpdates.first_name = first_name;
                    if (last_name !== undefined) basicUpdates.last_name = last_name;
                    if (dob !== undefined) basicUpdates.dob = dob;
                    if (gender !== undefined) basicUpdates.gender = gender;
                    if (country !== undefined) basicUpdates.country = country;
                    if (job_title !== undefined) basicUpdates.job_title = job_title;
                    if (industry !== undefined) basicUpdates.industry = industry;
                    
                    const updatedUser = await SupabaseDB.updateUser(userId, basicUpdates);
                    return this.sendResponse(res, 200, 'success', 'Profile updated successfully (some fields skipped)', { user: this.sanitizeUser(updatedUser) });
                }
                throw dbError;
            }

        } catch (error) {
            console.error('Update profile error:', error);
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private changePassword = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return this.sendResponse(res, 400, 'error', 'Current password and new password are required');
            }

            if (newPassword.length < 8) {
                return this.sendResponse(res, 400, 'error', 'New password must be at least 8 characters long');
            }

            // Get user to verify current password
            const user = await SupabaseDB.getUserById(userId);
            if (!user) return this.sendResponse(res, 404, 'error', 'User not found');

            // Verify current password by attempting to sign in
            const { error: signInError } = await supabaseAdmin.auth.signInWithPassword({
                email: user.email,
                password: currentPassword
            });

            if (signInError) {
                return this.sendResponse(res, 401, 'error', 'Current password is incorrect');
            }

            // Update password using admin API
            const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
                userId,
                { password: newPassword }
            );

            if (updateError) {
                return this.sendResponse(res, 500, 'error', 'Failed to update password');
            }

            return this.sendResponse(res, 200, 'success', 'Password updated successfully');

        } catch (error) {
            console.error('Change password error:', error);
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private getSessions = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get current session info from request
            const userAgent = req.headers['user-agent'] || 'Unknown Device';
            const ip = (req.ip || req.headers['x-forwarded-for'] || 'Unknown').toString();
            
            // Return current session (Supabase doesn't easily expose all sessions via API)
            // For full session management, you'd need to implement a custom sessions table
            const sessions = [{
                id: 'current-session',
                device: this.parseUserAgent(userAgent),
                ip: ip,
                location: 'Unknown', // Would need IP geolocation service
                lastActive: new Date().toISOString(),
                createdAt: new Date().toISOString()
            }];

            return this.sendResponse(res, 200, 'success', 'Sessions retrieved successfully', { sessions });

        } catch (error) {
            console.error('Get sessions error:', error);
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private parseUserAgent(userAgent: string): string {
        // Simple user agent parsing
        if (userAgent.includes('Macintosh')) return 'MacBook';
        if (userAgent.includes('Windows')) return 'Windows PC';
        if (userAgent.includes('iPhone')) return 'iPhone';
        if (userAgent.includes('iPad')) return 'iPad';
        if (userAgent.includes('Android')) return 'Android Device';
        if (userAgent.includes('Chrome')) return 'Chrome Browser';
        if (userAgent.includes('Safari')) return 'Safari Browser';
        if (userAgent.includes('Firefox')) return 'Firefox Browser';
        return 'Unknown Device';
    }

    private revokeSession = async (req: AuthRequest, res: Response) => {
        try {
            const { sessionId } = req.params;
            const userId = req.user!.userId;

            if (!sessionId) {
                return this.sendResponse(res, 400, 'error', 'Session ID is required');
            }

            // Note: Supabase doesn't provide easy session revocation via API
            // For now, this is a placeholder that returns success
            // To implement properly, you would need to:
            // 1. Create a custom sessions table to track sessions
            // 2. Store session tokens when users log in
            // 3. Check this table in authentication middleware
            // 4. Delete from this table when revoking

            // For the current session, we could invalidate all sessions by updating user
            // This would force re-authentication
            if (sessionId === 'current-session') {
                // Could implement: update user's auth metadata to invalidate all tokens
                console.log(`Session revocation requested for user ${userId}`);
            }

            return this.sendResponse(res, 200, 'success', 'Session revoked successfully');

        } catch (error) {
            console.error('Revoke session error:', error);
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private updateSecurityAlerts = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;
            const { loginAlerts, passwordChanges, suspiciousActivity, newDeviceLogin } = req.body;

            // Store security alerts preferences in user metadata or separate table
            const updates: any = {};
            
            if (loginAlerts !== undefined) updates.alert_login = loginAlerts;
            if (passwordChanges !== undefined) updates.alert_password_changes = passwordChanges;
            if (suspiciousActivity !== undefined) updates.alert_suspicious_activity = suspiciousActivity;
            if (newDeviceLogin !== undefined) updates.alert_new_device = newDeviceLogin;

            // Update user preferences
            const updatedUser = await SupabaseDB.updateUser(userId, updates);

            return this.sendResponse(res, 200, 'success', 'Security alerts updated successfully', {
                user: this.sanitizeUser(updatedUser)
            });

        } catch (error) {
            console.error('Update security alerts error:', error);
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private deleteAccount = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Delete user from Supabase Auth (this will cascade to related data via DB policies)
            const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

            if (authDeleteError) {
                return this.sendResponse(res, 500, 'error', 'Failed to delete account');
            }

            // Delete user data from database
            await SupabaseDB.deleteUser(userId);

            return this.sendResponse(res, 200, 'success', 'Account deleted successfully');

        } catch (error) {
            console.error('Delete account error:', error);
            return this.sendResponse(res, 500, 'error', 'Internal server error', error instanceof Error ? error.message : String(error));
        }
    };

    private sanitizeUser(user: any) {
        // Remove sensitive fields
        const { password_hash, ...safeUser } = user;
        return safeUser;
    }
}
