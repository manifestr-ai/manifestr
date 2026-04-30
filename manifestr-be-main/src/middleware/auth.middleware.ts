import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../lib/supabase';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        email_confirmed_at?: string;
    };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized: No token provided'
            });
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized: Invalid token format'
            });
        }

        // Verify token with Supabase
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            return res.status(403).json({
                status: 'error',
                message: 'Forbidden: Invalid or expired token'
            });
        }

        // Attach user info to request
        req.user = {
            userId: user.id,
            email: user.email!,
            email_confirmed_at: user.email_confirmed_at
        };

        next();
    } catch (error) {
        return res.status(403).json({
            status: 'error',
            message: 'Forbidden: Invalid or expired token'
        });
    }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            // No token provided - continue as anonymous user
            req.user = {
                userId: 'anonymous',
                email: 'anonymous@manifestr.ai',
            };
            return next();
        }

        const token = authHeader.split(' ')[1];

        if (!token) {
            // Invalid token format - continue as anonymous user
            req.user = {
                userId: 'anonymous',
                email: 'anonymous@manifestr.ai',
            };
            return next();
        }

        // Try to verify token with Supabase
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            // Invalid or expired token - continue as anonymous user
            req.user = {
                userId: 'anonymous',
                email: 'anonymous@manifestr.ai',
            };
            return next();
        }

        // Valid token - attach user info to request
        req.user = {
            userId: user.id,
            email: user.email!,
            email_confirmed_at: user.email_confirmed_at
        };

        next();
    } catch (error) {
        // On any error, continue as anonymous user
        req.user = {
            userId: 'anonymous',
            email: 'anonymous@manifestr.ai',
        };
        next();
    }
};
