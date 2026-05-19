import { Response } from "express";
import { BaseController } from "./base.controller";
import { AuthRequest, authenticateToken } from "../middleware/auth.middleware";
import { SearchService } from "../services/search.service";
import { EventTrackingService } from "../services/EventTracking.service";

export class SearchController extends BaseController {
  public basePath = "/api/search";

  protected initializeRoutes(): void {
    this.routes = [
      {
        verb: "GET",
        path: "/",
        handler: this.globalSearch,
        middlewares: [authenticateToken],
      },
    ];
  }

  private globalSearch = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const q = (req.query.q as string) || "";
      const limit = Math.min(
        parseInt((req.query.limit as string) || "10", 10) || 10,
        25,
      );

      if (!q.trim()) {
        return res.json({
          status: "success",
          data: { results: [], query: "" },
        });
      }

      const results = await SearchService.search(userId, q, limit);

      EventTrackingService.track({
        userId,
        eventName: "Global Search",
        eventCategory: "product_usage",
        eventAction: "global_search",
        properties: {
          query: q.trim(),
          resultCount: results.length,
        },
      }).catch(() => {});

      return res.json({
        status: "success",
        data: {
          results,
          query: q.trim(),
          count: results.length,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: (error as Error).message,
      });
    }
  };
}
