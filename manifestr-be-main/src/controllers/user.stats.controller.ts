import { Response } from 'express';
import { BaseController } from './base.controller';
import { authenticateToken, optionalAuth, AuthRequest } from '../middleware/auth.middleware';
import { supabaseAdmin } from '../lib/supabase';

export class UserStatsController extends BaseController {
    public basePath = '/user-stats';

    protected initializeRoutes() {
        this.routes = [
            { verb: 'GET', path: '/', handler: this.getUserStats, middlewares: [optionalAuth] },
        ];
    }

    /**
     * Get comprehensive user statistics
     */
    private getUserStats = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user!.userId;

            // Get current date and start of week
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
            startOfWeek.setHours(0, 0, 0, 0);

            // Fetch all user generations
            const { data: allGenerations, error: allError } = await supabaseAdmin
                .from('generation_jobs')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'completed');

            if (allError) {
                console.error('Error fetching all generations:', allError);
            }

            // Fetch generations from this week
            const { data: weekGenerations, error: weekError } = await supabaseAdmin
                .from('generation_jobs')
                .select('*')
                .eq('user_id', userId)
                .eq('status', 'completed')
                .gte('created_at', startOfWeek.toISOString());

            if (weekError) {
                console.error('Error fetching week generations:', weekError);
            }

            const totalDocs = allGenerations?.length || 0;
            const weekDocs = weekGenerations?.length || 0;

            // Calculate total points (10 points per document)
            const totalPoints = totalDocs * 10;

            // Calculate level (every 100 points = 1 level)
            const currentLevel = Math.floor(totalPoints / 100) + 1;
            const currentLevelPoints = totalPoints % 100;
            const pointsToNextLevel = 100 - currentLevelPoints;

            // Calculate time saved (estimate: 30 min per document)
            const totalTimeSavedMinutes = totalDocs * 30;
            const weekTimeSavedMinutes = weekDocs * 30;
            const weekTimeSavedHours = Math.floor(weekTimeSavedMinutes / 60);

            // Count tools used this week
            const toolsUsedThisWeek = new Set<string>();
            const toolCounts: { [key: string]: number } = {};

            weekGenerations?.forEach(gen => {
                const contentType = gen.content_type || 'unknown';
                toolsUsedThisWeek.add(contentType);
                toolCounts[contentType] = (toolCounts[contentType] || 0) + 1;
            });

            // Find most used tool
            let mostUsedTool = 'None';
            let maxCount = 0;
            Object.entries(toolCounts).forEach(([tool, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    mostUsedTool = tool;
                }
            });

            // Map content types to friendly names
            const toolNameMap: { [key: string]: string } = {
                'spreadsheet': 'The Analyst',
                'presentation': 'The Presenter',
                'document': 'The Wordsmith',
                'professional_docx': 'The Strategist',
                'image': 'The Designer',
                'chart': 'The Visualizer',
                'video': 'The Producer',
                'audio': 'The Composer',
            };

            const mostUsedToolName = toolNameMap[mostUsedTool] || mostUsedTool;

            // Total available tools
            const totalTools = 8;
            const usedTools = toolsUsedThisWeek.size;

            return res.json({
                status: 'success',
                data: {
                    level: {
                        current: currentLevel,
                        currentPoints: totalPoints,
                        currentLevelPoints: currentLevelPoints,
                        pointsToNextLevel: pointsToNextLevel,
                        nextLevelAt: currentLevel * 100,
                    },
                    timeSaved: {
                        totalHours: Math.floor(totalTimeSavedMinutes / 60),
                        weekHours: weekTimeSavedHours,
                        weekMinutes: weekTimeSavedMinutes % 60,
                    },
                    documents: {
                        total: totalDocs,
                        thisWeek: weekDocs,
                    },
                    tools: {
                        usedThisWeek: usedTools,
                        total: totalTools,
                        mostUsed: mostUsedToolName,
                        mostUsedType: mostUsedTool,
                        usageCount: maxCount,
                    },
                },
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
            return res.status(500).json({
                status: 'error',
                message: (error as Error).message,
            });
        }
    };
}
