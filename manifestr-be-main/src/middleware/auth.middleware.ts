import { Request, Response, NextFunction } from 'express';
import { supabase, supabaseAdmin } from '../lib/supabase';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        email_confirmed_at?: string;
        is_admin?: boolean;
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

         // 🔥 Get full user (including is_admin)
            const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, email, is_admin')
            .eq('id', user.id)
            .single();

        if (userError || !userData) {
            return res.status(403).json({
                status: 'error',
                message: 'Forbidden: Invalid or expired token'
            });
        }
        // Attach user info to request
        req.user = {
            userId: user.id,
            email: user.email!,
            email_confirmed_at: user.email_confirmed_at,
            is_admin: userData.is_admin,
   
        };

        next();
    } catch (error) {
        return res.status(403).json({
            status: 'error',
            message: 'Forbidden: Invalid or expired token'
        });
    }
};
