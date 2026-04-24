import { Response } from "express";
import { BaseController } from "./base.controller";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";
import SupabaseDB from "../lib/supabase-db";

// helpers
const defaultMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const safeMax = (arr?: number[]) =>
  Math.max(...(arr && arr.length ? arr : [0]), 10);

export class AdminController extends BaseController {
  public basePath = "/api/admin";

  protected initializeRoutes(): void {
    this.routes = [
      {
        verb: "GET",
        path: "/overview",
        handler: this.getOverview,
        middlewares: [authenticateToken, adminMiddleware],
      },
      {
        verb: "GET",
        path: "/growth",
        handler: this.getGrowth,
        middlewares: [authenticateToken, adminMiddleware],
      },

      {
        verb: "GET",
        path: "/retention",
        handler: this.getRetention,
        middlewares: [authenticateToken, adminMiddleware],
      },
      {
        verb: "GET",
        path: "/lifecycle",
        handler: this.getLifecycle,
        middlewares: [authenticateToken],
      },
      {
        verb: "GET",
        path: "/product-usage",
        handler: this.getProductUsage,
        middlewares: [authenticateToken],
      },
      {
        verb: "GET",
        path: "/feature-adoption",
        handler: this.getFeatureAdoption,
        middlewares: [authenticateToken],
      },
      {
        verb: "GET",
        path: "/monetization",
        handler: this.getMonetization,
        middlewares: [authenticateToken],
      },
      {
        verb: "GET",
        path: "/ai-performance",
        handler: this.getAiPerformance,
        middlewares: [authenticateToken],
      },
      {
        verb: "GET",
        path: "/platform-health",
        handler: this.getPlatformHealth,
        middlewares: [authenticateToken],
      },
    ];
  }

  /**
   * GET /api/admin/overview
   */
  private getOverview = async (req: AuthRequest, res: Response) => {
    try {
      // =========================
      // STEP 1: READ FILTERS
      // =========================
      const timeframeRaw = req.query.timeframe;
      const searchRaw = req.query.search;

      const timeframe =
        typeof timeframeRaw === "string" ? timeframeRaw : "Last 30d";

      const search = typeof searchRaw === "string" ? searchRaw : undefined;

      const timeframeMap: Record<string, number | null> = {
        "Last 7d": 7,
        "Last 30d": 30,
        "Last 90d": 90,
        "This year": 365,
        "All time": 999,
      };

      const days = timeframeMap[timeframe] ?? 30;

      const since = days
        ? new Date(Date.now() - days * 86400000).toISOString()
        : undefined;

      // =========================
      // STEP 2: FETCH DATA (DYNAMIC)
      // =========================
      const [
        totalUsers,
        newUsers,
        prevUsers,
        userGrowth,
        recentUsers,
        dau,
        mau,
        activatedUsers,
        totalJobs,
        failedJobs,
      ] = await Promise.all([
        SupabaseDB.getUsersCount(since, search),

        SupabaseDB.getNewUsersLastDays(days),
        SupabaseDB.getNewUsersPreviousDays(days),

        SupabaseDB.getUserGrowthMonthly(since),

        SupabaseDB.getRecentUsers(5, since),

        SupabaseDB.getDAU(since),
        SupabaseDB.getMAU(since),

        SupabaseDB.getActivatedUsersCount(since),

        SupabaseDB.getTotalJobsCount(since),
        SupabaseDB.getFailedJobsCount(since),
      ]);

      // =========================
      // STEP 3: METRICS
      // =========================
      const dauMau = mau ? ((dau / mau) * 100).toFixed(1) + "%" : "0%";

      const activationRate = totalUsers
        ? ((activatedUsers / totalUsers) * 100).toFixed(1) + "%"
        : "0%";

      const signupChange = prevUsers
        ? (((newUsers - prevUsers) / prevUsers) * 100).toFixed(1) + "%"
        : "0%";

      const failureRate = totalJobs
        ? ((failedJobs / totalJobs) * 100).toFixed(1) + "%"
        : "0%";

      // =========================
      // STEP 4: SAFE CHART DATA
      // =========================
      const months = userGrowth?.months?.length
        ? userGrowth.months
        : defaultMonths;

      const series = userGrowth?.values?.length
        ? userGrowth.values
        : Array(12).fill(0);

      // =========================
      // STEP 5: RESPONSE
      // =========================
      const zero12 = Array(12).fill(0);

      const calcChange = (current: number, previous: number) => {
        if (!previous || previous === 0) return "0%";

        const change = ((current - previous) / previous) * 100;
        const sign = change > 0 ? "+" : "";

        return `${sign}${change.toFixed(1)}%`;
      };

      const totalUsersChange = calcChange(totalUsers, prevUsers);
      const growthChange = calcChange(newUsers, prevUsers);

      // fallback (until you track properly)
      const dauMauChange = "0%";
      const activationChange = "0%";

      const data = {
        header: {
          title: "Executive Overview",
          subtitle: "High-level snapshot of platform health.",
        },

        filters: {
          searchPlaceholder: "Search files, content, and tags...",
          options: {
            Timeframe: [
              "Last 7d",
              "Last 30d",
              "Last 90d",
              "This year",
              "All time",
            ],
            Cohort: ["All cohorts", "New users", "Returning", "Power users"],
            Persona: ["All personas", "Freelancer", "Agency", "Enterprise"],
            Device: ["All devices", "Desktop", "Mobile", "Tablet"],
          },
        },

        // =========================
        // STATS
        // =========================

        statRows: [
          [
            {
              title: "Total Users",
              value: totalUsers?.toLocaleString() || "0",
              change: totalUsersChange || "0%",
              period: `vs ${timeframe}`,
            },
            {
              title: "New Signups",
              value: newUsers?.toLocaleString() || "0",
              change: signupChange || "0%",
              period: "vs previous period",
            },
            {
              title: "DAU / MAU",
              value: dauMau || "0%",
              change: dauMauChange || "0%",
              period: "vs last period",
            },
          ],
          [
            {
              title: "Activation Rate",
              value: activationRate || "0%",
              change: activationChange || "0%",
              period: "vs last period",
            },
            {
              title: "MRR",
              value: "$0",
              change: "0%",
              period: "vs last period",
            },
            {
              title: "Revenue This Month",
              value: "$0",
              change: "0%",
              period: "vs last month",
            },
          ],
        ],

        // =========================
        // USER GROWTH
        // =========================
        userGrowth: {
          title: "User Growth",
          filterOptions: ["last 7d", "last 30d", "last 90d", "all time"],
          selectedFilter: timeframe?.toLowerCase() || "last 30d",
          months: months?.length ? months : defaultMonths,
          series: series?.length ? series : zero12,
          max: Math.max(...(series || [1]), 1),
          change: growthChange || "0%",
          period: `vs ${timeframe}`,
        },

        // =========================
        // REVENUE TREND
        // =========================
        revenueTrend: {
          title: "Revenue Trend",
          filterOptions: ["Both", "MRR", "ARR"],
          selectedFilter: "Both",
          months: defaultMonths,
          yLabels: ["80K", "60K", "40K", "20K", "10K", "0"],
          mrrData: zero12,
          arrData: zero12,
          mrrDollar: Array(12).fill("$0"),
          arrDollar: Array(12).fill("$0"),
          max: 0,
          change: "0%",
          period: "MoM",
        },

        // =========================
        // CONVERSION FUNNEL
        // =========================
        conversionFunnel: {
          title: "Conversion Funnel",
          steps: [
            {
              label: "Users",
              value: totalUsers || 0,
              valueLabel: totalUsers?.toLocaleString() || "0",
            },
            {
              label: "Signups",
              value: newUsers || 0,
              valueLabel: newUsers?.toLocaleString() || "0",
            },
            {
              label: "Activated",
              value: activatedUsers || 0,
              valueLabel: activatedUsers?.toLocaleString() || "0",
            },
            {
              label: "Paying",
              value: 0,
              valueLabel: "0",
            },
            {
              label: "Retained (90d)",
              value: 0,
              valueLabel: "0",
            },
          ],
        },

        // =========================
        // RECENT ACTIVITY
        // =========================
        recentActivity: {
          title: "Recent Activity",
          events: recentUsers?.length
            ? recentUsers.map((u, i) => ({
                id: `ev-${i}`,
                type: "signup",
                actor: u.email || "user",
                description: `New signup — ${u.email || "unknown"}`,
                time: new Date(u.created_at).toLocaleDateString(),
              }))
            : [
                {
                  id: "ev-0",
                  type: "system",
                  actor: "System",
                  description: "No recent activity",
                  time: "now",
                },
              ],
        },

        // =========================
        // ALERTS
        // =========================
        alerts: {
          title: "Alerts",

          system: [
            {
              id: "sys-1",
              title:
                failureRate && failureRate !== "0%"
                  ? "High Failure Rate Detected"
                  : "System Stable",
              description:
                failureRate && failureRate !== "0%"
                  ? `Failure rate is ${failureRate}`
                  : "No major issues detected",
              severity:
                failureRate && failureRate !== "0%" ? "warning" : "info",
              time: "now",
            },
          ],

          revenue: [
            {
              id: "rev-1",
              title: "No Revenue Data",
              description: "Billing system not integrated",
              severity: "info",
              time: "now",
            },
          ],

          churn: [
            {
              id: "churn-1",
              title: "No Churn Data",
              description: "Churn tracking not available",
              severity: "info",
              time: "now",
            },
          ],
        },
      };

      return res.json({
        status: "success",
        details: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: (error as Error).message,
      });
    }
  };

  /**
   * GET /api/admin/growth
   */
  private getGrowth = async (req: AuthRequest, res: Response) => {
    try {
      const timeframeRaw = req.query.timeframe;
      const searchRaw = req.query.search;

      const timeframe =
        typeof timeframeRaw === "string" ? timeframeRaw : "Last 30d";

      const search = typeof searchRaw === "string" ? searchRaw : undefined;

      const timeframeMap: Record<string, number | null> = {
        "Last 7d": 7,
        "Last 30d": 30,
        "Last 90d": 90,
        "This year": 365,
        "All time": 999,
      };

      const days = timeframeMap[timeframe] ?? 30;

      const since = days
        ? new Date(Date.now() - days * 86400000).toISOString()
        : undefined;

      const [
        totalUsers,
        newUsers30d,
        newUsersPrev30d,
        dau,
        mau,
        signupsMonthly,
        returningVsNew,
        topUsers,
        regionValues,
        activatedUsers,
      ] = await Promise.all([
        SupabaseDB.getUsersCount(since, search),
        SupabaseDB.getNewUsersLastDays(days),
        SupabaseDB.getNewUsersPreviousDays(days),

        SupabaseDB.getDAU(since),
        SupabaseDB.getMAU(since),

        SupabaseDB.getUserGrowthMonthly(since),
        SupabaseDB.getReturningVsNewMonthly(since),

        SupabaseDB.getPowerUsers(since),
        SupabaseDB.getUsersByRegion(since),

        SupabaseDB.getActivatedUsersCount(since),
      ]);

      // -------------------------
      // Derived Metrics
      // -------------------------

      const dauMau = mau ? ((dau / mau) * 100).toFixed(1) : "0";

      // FIXED activation logic (correct)
      const activationRate = totalUsers
        ? Math.round((activatedUsers / totalUsers) * 100)
        : 0;

      // signup growth %
      const signupChange = newUsersPrev30d
        ? (((newUsers30d - newUsersPrev30d) / newUsersPrev30d) * 100).toFixed(1)
        : "0";

      // -------------------------
      // Growth Series
      // -------------------------

      const months = signupsMonthly?.months?.length
        ? signupsMonthly.months
        : defaultMonths;

      const signupSeries = signupsMonthly?.values?.length
        ? signupsMonthly.values
        : Array(12).fill(0);

      const returning = returningVsNew?.returning || Array(12).fill(0);
      const newUsersSeries = returningVsNew?.newUsers || Array(12).fill(0);

      // -------------------------
      // User Type %
      // -------------------------

      const totalNew = newUsersSeries.reduce((a, b) => a + b, 0);
      const totalReturning = returning.reduce((a, b) => a + b, 0);
      const total = totalNew + totalReturning || 1;

      const returningPct = Math.round((totalReturning / total) * 100);
      const newPct = 100 - returningPct;

      // -------------------------
      // Response
      // -------------------------

      const zero12 = Array(12).fill(0);

      const data = {
        header: {
          title: "Growth & User Health",
          subtitle: "Understand acquisition quality and engagement.",
        },

        filters: {
          searchPlaceholder: "Search users, channels, regions...",
          options: {
            Timeframe: [
              "Last 7d",
              "Last 30d",
              "Last 90d",
              "This year",
              "All time",
            ],
            Channel: ["All channels", "Organic", "Paid", "Referral", "Direct"],
            Plan: ["All plans", "Starter", "Pro", "Enterprise"],
            Region: ["All regions", "N. America", "Europe", "Asia", "Other"],
          },
        },

        // =========================
        // STATS
        // =========================
        stats: [
          {
            title: "New Signups (30d)",
            value: newUsers30d?.toLocaleString() || "0",
            change: signupChange || "0%",
            period: "vs last 30d",
          },
          {
            title: "Activation Rate",
            value: `${activationRate || 0}%`,
            change: "0%",
            period: "vs last 30d",
          },
          {
            title: "DAU / MAU",
            value: `${dauMau || 0}%`,
            change: "0%",
            period: "vs last 30d",
          },
          {
            title: "Returning Users",
            value: `${returningPct || 0}%`,
            change: "0%",
            period: "vs last 30d",
          },
        ],

        // =========================
        // SIGNUPS CHART
        // =========================
        signupsOverTime: {
          title: "Signups Over Time",
          filterOptions: ["last 7d", "last 30d", "last 90d", "all time"],
          selectedFilter: "last 30d",
          months: months?.length ? months : defaultMonths,
          series: signupSeries?.length ? signupSeries : zero12,
          max: Math.max(...(signupSeries || [1]), 1),
          change: signupChange || "0%",
          period: "vs last 30d",
        },

        // =========================
        // RETURNING VS NEW
        // =========================
        returningVsNew: {
          title: "Returning vs New Users",
          filterOptions: ["last 7d", "last 30d", "last 90d"],
          selectedFilter: "last 30d",
          months: returningVsNew?.months || defaultMonths,
          yLabels: ["600", "500", "400", "300", "200", "0"],
          returning: returning?.length ? returning : zero12,
          newUsers: newUsersSeries?.length ? newUsersSeries : zero12,
          max: Math.max(...(returning || [0]), ...(newUsersSeries || [0]), 10),
          legend: [
            { label: "Returning", color: "#18181b" },
            { label: "New", color: "#a1a1aa" },
          ],
        },

        // =========================
        // REGION
        // =========================
        breakdownByRegion: {
          title: "By Region",
          xLabels: ["N. America", "Europe", "Asia", "Other"],
          values: regionValues?.length ? regionValues : [0, 0, 0, 0],
          max: 50,
          yLabels: ["50%", "40%", "30%", "20%", "10%", "0%"],
          footer: "Share of signups (%)",
        },

        // =========================
        // SOURCE (NO DATA → ZERO)
        // =========================
        breakdownBySource: {
          title: "By Source",
          xLabels: ["Organic", "Paid Search", "Referral", "Direct"],
          values: [0, 0, 0, 0],
          max: 50,
          yLabels: ["50%", "40%", "30%", "20%", "10%", "0%"],
          footer: "Share of signups (%)",
        },

        // =========================
        // USER TYPE
        // =========================
        breakdownByUserType: {
          title: "By User Type",
          organic: returningPct || 0,
          paid: newPct || 0,
          legend: [
            { label: "Returning", color: "#18181b" },
            { label: "New", color: "#94a3b8" },
          ],
        },

        // =========================
        // USER HEALTH
        // =========================
        userHealthScore: {
          title: "User Health Score",
          averageScore: 0,
          distribution: {
            green: { label: "Healthy", range: "≥70", count: 0, pct: 0 },
            amber: { label: "At Risk", range: "40–69", count: 0, pct: 0 },
            red: { label: "Critical", range: "<40", count: 0, pct: 0 },
          },
          weights: [],
        },

        // =========================
        // POWER USERS
        // =========================
        powerUsers: {
          title: "Power Users",
          subtitle: "Top active users",
          rows: topUsers?.length
            ? topUsers.map((u, i) => ({
                id: u.id || `u-${i}`,
                name: u.name || "User",
                company: "Unknown",
                outputsCreated: u.outputsCreated || 0,
                sessions: u.sessions || 0,
                lastActive: u.lastActive || "recent",
                healthScore: u.healthScore || 0,
              }))
            : [],
        },
      };

      return res.json({
        status: "success",
        details: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: (error as Error).message,
      });
    }
  };

  /**
   * GET /api/admin/retention
   */
  private getRetention = async (req: AuthRequest, res: Response) => {
    try {
      const timeframeRaw = req.query.timeframe;
      const searchRaw = req.query.search;

      const timeframe =
        typeof timeframeRaw === "string" ? timeframeRaw : "Last 30d";

      const search = typeof searchRaw === "string" ? searchRaw : undefined;

      const timeframeMap: Record<string, number | null> = {
        "Last 7d": 7,
        "Last 30d": 30,
        "Last 90d": 90,
        "This year": 365,
        "All time": 999,
      };

      const days = timeframeMap[timeframe] ?? 30;

      const since = days
        ? new Date(Date.now() - days * 86400000).toISOString()
        : undefined;

      const [users, jobs] = await Promise.all([
        SupabaseDB.getAllUsers(since),
        SupabaseDB.getAllJobs(since),
      ]);

      const totalUsers = users.length;
      const now = Date.now();

      // =========================
      // USER MAP (OPTIMIZATION)
      // =========================
      const userMap = new Map<string, any>();
      users.forEach((u: any) => {
        userMap.set(u.id, u);
      });

      // =========================
      // ACTIVE USERS (last 30d)
      // =========================
      const activeUsersSet = new Set(
        jobs
          .filter(
            (j: any) => now - new Date(j.created_at).getTime() <= 30 * 86400000,
          )
          .map((j: any) => j.user_id),
      );

      const activeUsers = activeUsersSet.size;

      const avgRetention = totalUsers
        ? Math.round((activeUsers / totalUsers) * 100)
        : 0;

      const churnRate = 100 - avgRetention;
      const churnedAccounts = totalUsers - activeUsers;

      // =========================
      // COHORT GROUPING
      // =========================
      const cohortMap: Record<string, string[]> = {};

      users.forEach((u: any) => {
        const d = new Date(u.created_at);
        const key = `${d.toLocaleString("default", {
          month: "short",
        })} ${d.getFullYear()}`;

        if (!cohortMap[key]) cohortMap[key] = [];
        cohortMap[key].push(u.id);
      });

      // =========================
      // RETENTION CALCULATOR
      // =========================
      const getRetentionCount = (userIds: string[], days: number) => {
        const userSet = new Set(userIds);

        return new Set(
          jobs
            .filter((j: any) => {
              if (!userSet.has(j.user_id)) return false;

              const user = userMap.get(j.user_id);
              if (!user) return false;

              return (
                new Date(j.created_at).getTime() -
                  new Date(user.created_at).getTime() <=
                days * 86400000
              );
            })
            .map((j: any) => j.user_id),
        ).size;
      };

      // =========================
      // COHORT RETENTION
      // =========================
      const cohortRows = Object.entries(cohortMap)
        .slice(-6)
        .reverse()
        .map(([cohort, userIds]) => {
          const size = userIds.length;

          const retained1d = getRetentionCount(userIds, 1);
          const retained7d = getRetentionCount(userIds, 7);
          const retained30d = getRetentionCount(userIds, 30);

          return {
            cohort,
            size: `${size} users`,
            values: [
              size ? Math.round((retained1d / size) * 100) : 0,
              size ? Math.round((retained7d / size) * 100) : 0,
              size ? Math.round((retained30d / size) * 100) : 0,
            ],
          };
        });

      // =========================
      // STATIC / NOT AVAILABLE DATA
      // =========================
      const retentionCurve = {
        title: "Retention Curve",
        filterOptions: ["All", "Day 1", "Day 7", "Day 30"],
        selectedFilter: "All",
        months: defaultMonths,
        yLabels: ["100%", "80%", "60%", "40%", "20%", "0%"],
        max: 100,
        min: 0,
        series: [
          { label: "Day 1", color: "#18181b", data: Array(12).fill(0) },
          { label: "Day 7", color: "#52525b", data: Array(12).fill(0) },
          { label: "Day 30", color: "#a1a1aa", data: Array(12).fill(0) },
        ],
      };

      const churnRateTrend = {
        title: "Churn Trend",
        filterOptions: ["Both", "Customer Churn", "Revenue Churn"],
        months: defaultMonths,
        yLabels: ["6%", "5%", "4%", "3%", "2%", "1%", "0%"],
        max: 6,
        min: 0,
        series: [
          {
            label: "Customer Churn",
            color: "#18181b",
            data: Array(12).fill(churnRate / 10),
          },
          {
            label: "Revenue Churn",
            color: "#8696b0",
            data: Array(12).fill(0),
          },
        ],
      };

      // =========================
      // FINAL RESPONSE
      // =========================
      const zero12 = Array(12).fill(0);

      const data = {
        header: {
          title: "Retention & Churn",
          subtitle:
            "Core SaaS health — cohorts, churn trends, and revenue retention.",
        },

        filters: {
          searchPlaceholder: "Search cohorts, plans, segments...",
          options: {
            Timeframe: [
              "Last 7d",
              "Last 30d",
              "Last 90d",
              "This year",
              "All time",
            ],
            Plan: ["All plans", "Starter", "Pro", "Enterprise"],
            Segment: [
              "All segments",
              "SMB",
              "Mid-Market",
              "Enterprise",
              "Self-serve",
            ],
            Source: [
              "All sources",
              "Organic",
              "Paid Search",
              "Referral",
              "Direct",
            ],
          },
        },

        // =========================
        // STATS
        // =========================
        stats: [
          {
            id: "churnRate",
            title: "Churn Rate",
            value: `${churnRate || 0}%`,
            change: "0%",
            period: "vs last 30d",
          },
          {
            id: "reactivationRate",
            title: "Reactivation Rate",
            value: "0%",
            change: "0%",
            period: "vs last 30d",
          },
          {
            id: "avgRetention",
            title: "Avg Retention (30d)",
            value: `${avgRetention || 0}%`,
            change: "0%",
            period: "vs last 30d",
          },
          {
            id: "churnedAccounts",
            title: "Churned This Month",
            value: churnedAccounts?.toString() || "0",
            change: "0",
            period: "vs last month",
          },
        ],

        // =========================
        // COHORT TABLE
        // =========================
        cohortRetention: {
          title: "Cohort Retention",
          subtitle:
            "Share of users retained 1 day, 7 days, and 30 days after sign-up.",
          periods: ["1d", "7d", "30d"],
          rows: cohortRows?.length
            ? cohortRows
            : [
                {
                  cohort: "No data",
                  size: "0 users",
                  values: [0, 0, 0],
                },
              ],
        },

        // =========================
        // RETENTION CURVE
        // =========================
        retentionCurve: {
          title: "Retention Curve",
          filterOptions: ["All", "Day 1", "Day 7", "Day 30"],
          selectedFilter: "All",
          months: defaultMonths,
          yLabels: ["100%", "80%", "60%", "40%", "20%", "0%"],
          max: 100,
          min: 0,
          series: [
            { label: "Day 1", color: "#18181b", data: zero12 },
            { label: "Day 7", color: "#52525b", data: zero12 },
            { label: "Day 30", color: "#a1a1aa", data: zero12 },
          ],
        },

        // =========================
        // CHURN TREND
        // =========================
        churnRateTrend: {
          title: "Churn Trend",
          filterOptions: ["Both", "Customer Churn", "Revenue Churn"],
          months: defaultMonths,
          yLabels: ["6%", "5%", "4%", "3%", "2%", "1%", "0%"],
          max: 6,
          min: 0,
          series: [
            { label: "Customer Churn", color: "#18181b", data: zero12 },
            { label: "Revenue Churn", color: "#8696b0", data: zero12 },
          ],
        },

        // =========================
        // REVENUE RETENTION
        // =========================
        revenueRetention: {
          title: "Revenue Retention",
          metrics: [
            {
              id: "nrr",
              title: "NRR",
              value: "0%",
              change: "0%",
              period: "vs last 30d",
            },
            {
              id: "grr",
              title: "GRR",
              value: "0%",
              change: "0%",
              period: "vs last 30d",
            },
            {
              id: "expansion",
              title: "Expansion Revenue",
              value: "$0",
              change: "0%",
              period: "vs last 30d",
            },
            {
              id: "contraction",
              title: "Contraction Revenue",
              value: "$0",
              change: "0%",
              period: "vs last 30d",
            },
          ],
        },

        // =========================
        // NRR / GRR TREND
        // =========================
        nrrGrrTrend: {
          title: "NRR / GRR Trend",
          filterOptions: ["Both", "NRR", "GRR"],
          months: defaultMonths,
          yLabels: ["120%", "110%", "100%", "90%", "80%"],
          max: 120,
          min: 80,
          series: [
            { label: "NRR", color: "#18181b", data: zero12 },
            { label: "GRR", color: "#8696b0", data: zero12 },
          ],
        },

        // =========================
        // CHURN ANALYSIS
        // =========================
        churnAnalysis: {
          title: "Churn Analysis",
          byPlan: {
            title: "By Plan",
            rows: [
              { label: "Starter", value: 0 },
              { label: "Pro", value: 0 },
              { label: "Enterprise", value: 0 },
            ],
          },
          bySegment: {
            title: "By Segment",
            rows: [
              { label: "SMB", value: 0 },
              { label: "Mid-Market", value: 0 },
              { label: "Enterprise", value: 0 },
            ],
          },
          bySource: {
            title: "By Source",
            rows: [
              { label: "Organic", value: 0 },
              { label: "Paid Search", value: 0 },
              { label: "Referral", value: 0 },
              { label: "Direct", value: 0 },
            ],
          },
        },

        // =========================
        // CHURN REASONS
        // =========================
        churnReasons: {
          title: "Churn Reasons",
          subtitle: `${churnedAccounts || 0} churned accounts`,
          segments: [
            { label: "Price", value: 0, color: "#18181b" },
            { label: "Missing features", value: 0, color: "#52525b" },
            { label: "Competitor", value: 0, color: "#8696b0" },
            { label: "Low usage", value: 0, color: "#a1a1aa" },
            { label: "Other", value: 0, color: "#d4d4d8" },
          ],
        },
      };

      return res.json({
        status: "success",
        details: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: (error as Error).message,
      });
    }
  };

  /**
   * GET /api/admin/lifecycle
   */
  private getLifecycle = async (req: AuthRequest, res: Response) => {
    try {
      const timeframeRaw = req.query.timeframe;
      const searchRaw = req.query.search;

      const timeframe =
        typeof timeframeRaw === "string" ? timeframeRaw : "Last 30d";

      const search = typeof searchRaw === "string" ? searchRaw : undefined;

      const timeframeMap: Record<string, number | null> = {
        "Last 7d": 7,
        "Last 30d": 30,
        "Last 90d": 90,
        "This year": 365,
        "All time": 999,
      };

      const days = timeframeMap[timeframe] ?? 30;

      const since = days
        ? new Date(Date.now() - days * 86400000).toISOString()
        : undefined;

      const { users, jobs } = await SupabaseDB.getUsersWithActivity(since);

      const now = Date.now();

      // =========================
      // MAP user → activity timestamps
      // =========================
      const activityMap = new Map<string, number[]>();

      jobs.forEach((j: any) => {
        if (!activityMap.has(j.user_id)) {
          activityMap.set(j.user_id, []);
        }
        activityMap.get(j.user_id)!.push(new Date(j.created_at).getTime());
      });

      // =========================
      // STAGE COUNTERS
      // =========================
      const stages = {
        new: 0,
        activated: 0,
        engaged: 0,
        power_user: 0,
        at_risk: 0,
        dormant: 0,
        churned: 0,
        reactivated: 0,
      };

      // =========================
      // USER CLASSIFICATION
      // =========================
      users.forEach((u: any) => {
        const created = new Date(u.created_at).getTime();
        const userJobs = activityMap.get(u.id) || [];

        const sessions = userJobs.length;

        const lastActivity = userJobs.length ? Math.max(...userJobs) : created;

        const daysSinceActive = (now - lastActivity) / 86400000;

        // 🔥 ORDER MATTERS (VERY IMPORTANT)

        if (sessions === 0) {
          // never used product
          stages.new++;
        } else if (sessions <= 3 && daysSinceActive <= 7) {
          stages.activated++;
        } else if (sessions > 3 && sessions <= 15 && daysSinceActive <= 14) {
          stages.engaged++;
        } else if (sessions > 15 && daysSinceActive <= 14) {
          stages.power_user++;
        } else if (daysSinceActive > 14 && daysSinceActive <= 30) {
          stages.at_risk++;
        } else if (daysSinceActive > 30 && daysSinceActive <= 60) {
          stages.dormant++;
        } else if (daysSinceActive > 60) {
          stages.churned++;
        }
      });

      // =========================
      // REACTIVATED USERS (REAL LOGIC)
      // =========================
      const reactivatedUsers = new Set<string>();

      users.forEach((u: any) => {
        const userJobs = activityMap.get(u.id) || [];
        if (userJobs.length < 2) return;

        const sorted = userJobs.sort((a, b) => a - b);

        for (let i = 1; i < sorted.length; i++) {
          const gapDays = (sorted[i] - sorted[i - 1]) / 86400000;

          // gap >30 days and then came back recently
          if (gapDays > 30 && now - sorted[i] <= 30 * 86400000) {
            reactivatedUsers.add(u.id);
            break;
          }
        }
      });

      stages.reactivated = reactivatedUsers.size;

      const totalUsers = users.length;

      // =========================
      // BUILD STAGES
      // =========================
      const buildStage = (key: string, label: string, color: string) => {
        const value = (stages as any)[key] || 0;

        return {
          key,
          label,
          value,
          share: totalUsers ? Math.round((value / totalUsers) * 100) : 0,
          color,
        };
      };

      const lifecycleStages = [
        buildStage("new", "New", "#1e293b"),
        buildStage("activated", "Activated", "#334155"),
        buildStage("engaged", "Engaged", "#475569"),
        buildStage("power_user", "Power User", "#64748b"),
        buildStage("at_risk", "At Risk", "#94a3b8"),
        buildStage("dormant", "Dormant", "#a1a1aa"),
        buildStage("churned", "Churned", "#d4d4d8"),
        buildStage("reactivated", "Reactivated", "#7c3aed"),
      ];

      // =========================
      // FINAL RESPONSE
      // =========================
      const data = {
        header: {
          title: "User Lifecycle & Segmentation",
          subtitle: "Turn analytics into action — every stage, every segment.",
        },

        filters: {
          searchPlaceholder: "Search users, segments, plans...",
          options: {
            Timeframe: [
              "Last 7d",
              "Last 30d",
              "Last 90d",
              "This year",
              "All time",
            ],
            Plan: ["All plans", "Free", "Pro", "Team", "Enterprise"],
            Stage: [
              "All stages",
              "New",
              "Activated",
              "Engaged",
              "Power User",
              "At Risk",
              "Dormant",
              "Churned",
              "Reactivated",
            ],
            Persona: ["All personas", "Founder", "Operator", "Investor"],
          },
        },

        stats: [
          {
            id: "total",
            title: "Total Users",
            value: totalUsers.toString(),
            change: "N/A",
            period: "vs last 30d",
          },
          {
            id: "engaged",
            title: "Engaged + Power",
            value: (stages.engaged + stages.power_user).toString(),
            change: "N/A",
            period: "vs last 30d",
          },
          {
            id: "atRisk",
            title: "At Risk",
            value: stages.at_risk.toString(),
            change: "N/A",
            period: "vs last 30d",
          },
          {
            id: "reactivated",
            title: "Reactivated (30d)",
            value: stages.reactivated.toString(),
            change: "N/A",
            period: "vs last 30d",
          },
        ],

        lifecycleStages: {
          title: "Lifecycle Stages",
          subtitle: "Distribution of users across all 8 lifecycle stages.",
          total: totalUsers,
          stages: lifecycleStages,
        },

        segments: {
          title: "Lifecycle Segments",
          subtitle:
            "Per-stage metrics and action triggers for every user group.",
          rows: lifecycleStages.map((s) => ({
            id: s.key,
            stage: s.key,
            stageLabel: s.label,
            name: s.label,
            description: `${s.label} users`,
            users: s.value.toString(),
            avgOutputs: "N/A",
            revenueValue: "N/A",
            lastActivity: "N/A",
            actions: [],
          })),
        },
      };

      return res.json({
        status: "success",
        details: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: (error as Error).message,
      });
    }
  };

  /**
   * GET /api/admin/product-usage
   */
  private getProductUsage = async (req: AuthRequest, res: Response) => {
    try {
      const timeframeRaw = req.query.timeframe;
      const searchRaw = req.query.search;

      const timeframe =
        typeof timeframeRaw === "string" ? timeframeRaw : "Last 30d";

      const search = typeof searchRaw === "string" ? searchRaw : undefined;

      const timeframeMap: Record<string, number | null> = {
        "Last 7d": 7,
        "Last 30d": 30,
        "Last 90d": 90,
        "This year": 365,
        "All time": 999,
      };

      const days = timeframeMap[timeframe] ?? 30;

      const since = days
        ? new Date(Date.now() - days * 86400000).toISOString()
        : undefined;

      const [jobs, users] = await Promise.all([
        SupabaseDB.getAllJobs(since),
        SupabaseDB.getAllUsers(since),
      ]);

      const totalUsers = users.length;
      const totalOutputs = jobs.length;

      // =========================
      // OUTPUTS PER USER
      // =========================
      const outputsMap: Record<string, number> = {};

      jobs.forEach((j: any) => {
        outputsMap[j.user_id] = (outputsMap[j.user_id] || 0) + 1;
      });

      const outputsPerUser = totalUsers > 0 ? totalOutputs / totalUsers : 0;

      // =========================
      // TIME TO FIRST OUTPUT
      // =========================
      const firstOutputMap: Record<string, number> = {};

      jobs.forEach((j: any) => {
        const t = new Date(j.created_at).getTime();

        if (!firstOutputMap[j.user_id] || t < firstOutputMap[j.user_id]) {
          firstOutputMap[j.user_id] = t;
        }
      });

      const timeDiffs: number[] = [];

      users.forEach((u: any) => {
        const created = new Date(u.created_at).getTime();
        const first = firstOutputMap[u.id];

        if (first) {
          timeDiffs.push((first - created) / (1000 * 60 * 60)); // hours
        }
      });

      const avgTimeToFirst =
        timeDiffs.length > 0
          ? timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length
          : 0;

      // =========================
      // SESSION FREQUENCY (approx)
      // =========================
      const sessionsPerUser = totalUsers > 0 ? totalOutputs / totalUsers : 0;

      // =========================
      // COMPLETION RATE (REALISTIC PROXY)
      // =========================
      const completedJobs = jobs.filter(
        (j: any) => j.status === "completed",
      ).length;

      const completionRate =
        totalOutputs > 0 ? (completedJobs / totalOutputs) * 100 : 0;

      const abandonmentRate = 100 - completionRate;

      // =========================
      // SAFE ARRAYS
      // =========================
      const outputsArray = Object.values(outputsMap);

      const zero12 = Array(12).fill(0);

      const ALL_TOOLS = [
        "The Deck",
        "The Briefcase",
        "The Strategist",
        "The Wordsmith",
        "The Analyzer",
        "Cost CTRL",
        "Design Studio",
        "The Huddle",
      ];

      // ✅ FIX TYPE HERE
      const toolUsageMap: Record<string, number> = {};

      // Example future usage
      // jobs.forEach(j => {
      //   const tool = j.tool;
      //   if (tool) {
      //     toolUsageMap[tool] = (toolUsageMap[tool] || 0) + 1;
      //   }
      // });

      const toolUsers = ALL_TOOLS.map((tool) => ({
        name: tool,
        users: (toolUsageMap[tool] || 0).toLocaleString(),
      }));

      const data = {
        header: {
          title: "Product Usage & Engagement",
          subtitle: "Track how users interact with Manifestr tools.",
        },

        filters: {
          searchPlaceholder: "Search tools, users...",
          options: {
            Timeframe: [
              "Last 7d",
              "Last 30d",
              "Last 90d",
              "This year",
              "All time",
            ],
            Cohort: ["All cohorts", "New users", "Returning", "Power users"],
            Plan: ["All plans", "Free", "Pro", "Enterprise"],
            Tool: ["All tools", ...ALL_TOOLS],
          },
        },

        // =========================
        // CORE KPIs
        // =========================
        stats: [
          {
            title: "Outputs per User",
            value: outputsPerUser?.toFixed(2) || "0.00",
            change: "0%",
            period: "vs last period",
          },
          {
            title: "Time to First Output",
            value: `${avgTimeToFirst?.toFixed(1) || 0} hrs`,
            change: "0%",
            period: "vs last period",
          },
          {
            title: "Session Frequency",
            value: `${sessionsPerUser?.toFixed(1) || 0} / mo`,
            change: "0%",
            period: "vs last period",
          },
          {
            title: "Avg Session Duration",
            value: "0 min",
            change: "0%",
            period: "vs last period",
          },
          {
            title: "Completion Rate",
            value: `${completionRate?.toFixed(0) || 0}%`,
            change: "0%",
            period: "vs last period",
          },
          {
            title: "Abandonment Rate",
            value: `${abandonmentRate?.toFixed(0) || 0}%`,
            change: "0%",
            period: "vs last period",
          },
        ],

        behaviourStats: [
          {
            title: "Rewrites per Output",
            value: "0",
            change: "0%",
            period: "vs last period",
          },
          {
            title: "Accept Rate",
            value: "0%",
            change: "0%",
            period: "vs last period",
          },
          {
            title: "Edit Rate",
            value: "0%",
            change: "0%",
            period: "vs last period",
          },
        ],

        // =========================
        // CHARTS
        // =========================
        decksPerUser: {
          title: "Outputs per User",
          months: defaultMonths,
          data: outputsArray?.length ? outputsArray : zero12,
          min: 0,
          max: Math.max(...(outputsArray || [1]), 1),
        },

        timeToFirstOutput: {
          title: "Time to First Output",
          data: timeDiffs?.length ? timeDiffs : zero12,
          max: 100,
        },

        sessionFrequency: {
          title: "Session Frequency",
          data: outputsArray?.length ? outputsArray : zero12,
        },

        sessionDuration: {
          title: "Session Duration",
          data: zero12,
        },

        // =========================
        // ADVANCED
        // =========================
        slideTypes: {
          title: "Slide Types",
          slices: [
            { label: "Title + Content", value: 0 },
            { label: "Comparison", value: 0 },
            { label: "Chart", value: 0 },
            { label: "Quote", value: 0 },
            { label: "Others", value: 0 },
          ],
        },

        rewritesVsAccepts: {
          title: "Rewrites vs Accepts",
          months: defaultMonths,
          accepted: zero12,
          edited: zero12,
          max: 100,
        },

        exportTypes: {
          title: "Export Types",
          slices: [
            { label: "PDF", value: 0 },
            { label: "PPTX", value: 0 },
            { label: "DOCX", value: 0 },
            { label: "Other", value: 0 },
          ],
        },

        aiStyleSettingsUsage: {
          title: "AI Style Settings Usage",
          rows: [],
        },

        slideTimeHeatmap: {
          title: "Slide Time Heatmap",
          slides: [1, 2, 3, 4, 5, 6, 7],
          rows: Array(5).fill(Array(7).fill(0)),
        },

        slideDropoff: {
          title: "Slide Drop-off",
          data: zero12,
          max: 100,
        },

        slideRewritesVsAccepts: {
          title: "Rewrites vs Accepts",
          categories: [],
          max: 100,
        },

        rewritesVsAcceptsFlows: {
          title: "Rewrites vs Accepts",
          rows: [],
        },

        bouncedDecks: {
          title: "Bounced Decks",
          value: `${abandonmentRate?.toFixed(0) || 0}%`,
          valueLabel: "bounce rate",
          change: "0%",
          period: "vs last period",
          description: "Total started vs completed decks.",
          breakdown: "(0 started, 0 exported)",
        },

        completionTime: {
          title: "Completion Time",
          months: defaultMonths,
          data: zero12,
          min: 0,
          max: 100,
        },

        // =========================
        // JOURNEYS
        // =========================
        journeyModes: {
          defaultMode: "tools",
          options: [
            { id: "editors", label: "Editors" },
            { id: "tools", label: "Tools" },
          ],

          tools: {
            toolUsers: {
              tools: toolUsers,
            },
            mostCommonJourneys: { rows: [] },
            transitionDropoffsFunnel: { data: Array(6).fill(0) },
            multiToolUsage: { percent: "0%", rows: [] },
            toolPairingMatrix: { rows: [] },
          },

          editors: {
            toolUsers: { tools: [] },
            mostCommonJourneys: { rows: [] },
            transitionDropoffsFunnel: { data: Array(6).fill(0) },
            multiToolUsage: { percent: "0%", rows: [] },
            toolPairingMatrix: { rows: [] },
          },
        },

        toolUsers: {
          tools: toolUsers,
        },

        mostCommonJourneys: { rows: [] },
        transitionDropoffsFunnel: { data: Array(6).fill(0) },
        multiToolUsage: { percent: "0%", rows: [] },
        toolPairingMatrix: { rows: [] },
      };

      return res.json({
        status: "success",
        details: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: (error as Error).message,
      });
    }
  };
  /**
   * GET /api/admin/feature-adoption
   */
  private getFeatureAdoption = async (req: AuthRequest, res: Response) => {
    try {
      const timeframeRaw = req.query.timeframe;
      const searchRaw = req.query.search;

      const timeframe =
        typeof timeframeRaw === "string" ? timeframeRaw : "Last 30d";

      const search = typeof searchRaw === "string" ? searchRaw : undefined;

      const timeframeMap: Record<string, number | null> = {
        "Last 7d": 7,
        "Last 30d": 30,
        "Last 90d": 90,
        "This year": 365,
        "All time": 999,
      };

      const days = timeframeMap[timeframe] ?? 30;

      const since = days
        ? new Date(Date.now() - days * 86400000).toISOString()
        : undefined;

      const [users, jobs, collabProjects, collabMembers, docCollaborators] =
        await Promise.all([
          SupabaseDB.getAllUsers(since),
          SupabaseDB.getAllJobs(since),
          SupabaseDB.getCollabProjects(since),
          SupabaseDB.getCollabMembers(since),
          SupabaseDB.getDocumentCollaborators(since),
        ]);

      const totalUsers = users.length;

      // =========================
      // JOB COUNT MAP (OPTIMIZED)
      // =========================
      const jobCountMap = new Map<string, number>();

      jobs.forEach((j: any) => {
        jobCountMap.set(j.user_id, (jobCountMap.get(j.user_id) || 0) + 1);
      });

      // =========================
      // ADOPTION FUNNEL
      // =========================
      const discovered = totalUsers;

      let firstUse = 0;
      let repeat = 0;
      let habitual = 0;

      jobCountMap.forEach((count) => {
        if (count >= 1) firstUse++;
        if (count >= 2) repeat++;
        if (count >= 4) habitual++;
      });

      const percent = (val: number) =>
        discovered > 0 ? ((val / discovered) * 100).toFixed(1) : "0";

      // =========================
      // COLLABORATION
      // =========================
      const workspacesCreated = collabProjects.length;
      const membersAdded = collabMembers.length;

      const sharedDocs = docCollaborators.length;
      const soloDocs = Math.max(0, jobs.length - sharedDocs);

      // =========================
      // PROJECT MAP (OPTIMIZED)
      // =========================
      const projectMemberMap = new Map<string, number>();

      collabMembers.forEach((m: any) => {
        projectMemberMap.set(
          m.collab_project_id,
          (projectMemberMap.get(m.collab_project_id) || 0) + 1,
        );
      });

      const userJobMap = new Map<string, number>();
      jobs.forEach((j: any) => {
        userJobMap.set(j.user_id, (userJobMap.get(j.user_id) || 0) + 1);
      });

      // =========================
      // TOP PROJECTS
      // =========================
      const topProjects = collabProjects.slice(0, 5).map((p: any) => ({
        project: p.name,
        members: projectMemberMap.get(p.id) || 0,
        docs: userJobMap.get(p.created_by) || 0,
        exports: "N/A",
        lastActive: new Date(p.updated_at).toLocaleDateString(),
      }));

      // =========================
      // TEAM
      // =========================
      const team = users.slice(0, 5).map((u: any) => ({
        member: u.email,
        role: u.is_admin ? "Admin" : "User",
        docsCreated: userJobMap.get(u.id) || 0,
        exports: "N/A",
        lastActive: u.updated_at
          ? new Date(u.updated_at).toLocaleDateString()
          : "N/A",
      }));

      // =========================
      // MEMBERS TREND (SAFE)
      // =========================
      const avgMembers = Math.floor(membersAdded / 12);

      // =========================
      // FINAL RESPONSE
      // =========================
      const data = {
        header: {
          title: "Feature Adoption",
          subtitle: "Measure depth of feature usage.",
        },

        filters: {
          searchPlaceholder: "Search features...",
          options: {},
        },

        stats: [
          {
            id: "discovered",
            title: "Discovered",
            value: discovered.toString(),
          },
          {
            id: "firstUse",
            title: "First Use",
            value: firstUse.toString(),
          },
          {
            id: "repeatUse",
            title: "Repeat Use",
            value: repeat.toString(),
          },
          {
            id: "habitual",
            title: "Habitual",
            value: habitual.toString(),
          },
        ],

        adoptionFunnel: {
          title: "Overall Adoption Funnel",
          rows: [
            {
              label: "Discovered",
              sublabel: `${discovered} users`,
              percent: 100,
              display: "100%",
            },
            {
              label: "First Use",
              sublabel: `${firstUse} users`,
              percent: percent(firstUse),
              display: `${percent(firstUse)}%`,
            },
            {
              label: "Repeat Use",
              sublabel: `${repeat} users`,
              percent: percent(repeat),
              display: `${percent(repeat)}%`,
            },
            {
              label: "Habitual",
              sublabel: `${habitual} users`,
              percent: percent(habitual),
              display: `${percent(habitual)}%`,
            },
          ],
        },

        // ❌ NOT AVAILABLE (NO EVENT TRACKING)
        featureAdoptionGrid: { features: [] },
        topFeatures: { rows: [] },
        planBreakdown: { plans: [] },
        roleBreakdown: { plans: [] },
        regionBreakdown: { plans: [] },

        // =========================
        // COLLABORATION (REAL)
        // =========================
        workspacesCreated: {
          title: "Workspaces Created",
          total: `${workspacesCreated} total workspaces`,
          rows: collabProjects.slice(0, 5).map((p: any) => ({
            name: p.name,
            users: (projectMemberMap.get(p.id) || 0).toString(),
            percent: 0,
          })),
        },

        membersAdded: {
          title: "Members Added",
          bars: Array(12).fill(avgMembers),
          trend: Array(12).fill(avgMembers),
        },

        commentsPerDocument: {
          title: "Comments per Document",
          data: [], // ❌ no comments table
        },

        sharedVsSolo: {
          title: "Shared vs Solo Usage",
          slices: [
            { label: "Shared", value: sharedDocs },
            { label: "Solo", value: soloDocs },
          ],
        },

        topCollaborativeProjects: {
          title: "Top Collaborative Projects",
          rows: topProjects,
        },

        team: {
          title: "Team",
          rows: team,
        },
      };

      return res.json({
        status: "success",
        details: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: (error as Error).message,
      });
    }
  };

  /**
   * GET /api/admin/monetization
   */
  private getMonetization = async (req: AuthRequest, res: Response) => {
    try {
      const timeframeRaw = req.query.timeframe;
      const searchRaw = req.query.search;

      const timeframe =
        typeof timeframeRaw === "string" ? timeframeRaw : "Last 30d";

      const search = typeof searchRaw === "string" ? searchRaw : undefined;

      const timeframeMap: Record<string, number | null> = {
        "Last 7d": 7,
        "Last 30d": 30,
        "Last 90d": 90,
        "This year": 365,
        "All time": 999,
      };

      const days = timeframeMap[timeframe] ?? 30;

      const since = days
        ? new Date(Date.now() - days * 86400000).toISOString()
        : undefined;

      const [users, jobs] = await Promise.all([
        SupabaseDB.getAllUsers(),
        SupabaseDB.getAllJobs(),
      ]);

      const totalUsers = users.length;

      // =========================
      // ACTIVE USERS (REAL)
      // =========================
      const activeUsersSet = new Set(jobs.map((j: any) => j.user_id));
      const activeUsers = activeUsersSet.size;

      // =========================
      // BASIC USAGE MAP
      // =========================
      const usageMap = new Map<string, number>();

      jobs.forEach((j: any) => {
        usageMap.set(j.user_id, (usageMap.get(j.user_id) || 0) + 1);
      });

      // =========================
      // APPROX PAID USERS (ONLY FOR SIGNAL)
      // =========================
      const paidUsers = Array.from(usageMap.values()).filter(
        (c) => c > 3,
      ).length;

      const freeToPaid = totalUsers > 0 ? (paidUsers / totalUsers) * 100 : 0;

      // =========================
      // TOP USERS (USAGE-BASED)
      // =========================
      const topUsers = Array.from(usageMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7)
        .map(([userId, count]) => ({
          user: userId,
          plan: "N/A",
          mrr: "N/A",
          outputs: count,
          lastActive: "recent",
        }));

      // =========================
      // FINAL RESPONSE
      // =========================
      const data = {
        header: {
          title: "Monetization",
          subtitle: "Track revenue, conversion, and plan-level performance.",
        },

        filters: {
          Timeframe: {
            label: "30 days",
            options: ["7 days", "30 days", "90 days", "This year", "All time"],
          },
          Plan: {
            label: "All plans",
            options: ["All plans", "Free", "Pro", "Team", "Enterprise"],
          },
          Region: {
            label: "All regions",
            options: ["All regions", "N. America", "Europe", "Asia", "Other"],
          },
          Segment: {
            label: "All segments",
            options: ["All segments"],
          },
        },

        // ❌ NOT AVAILABLE
        totalRevenue: {
          title: "Total Revenue",
          value: "N/A",
          change: "N/A",
          period: "vs last month",
        },

        mrr: {
          title: "MRR",
          value: "N/A",
          change: "N/A",
          period: "vs last month",
        },

        arr: {
          title: "ARR",
          value: "N/A",
          change: "N/A",
          period: "vs last year",
        },

        // ⚠️ APPROX (USAGE-BASED ONLY)
        freeToPaid: {
          title: "Free → Paid (approx)",
          value: `${freeToPaid.toFixed(1)}%`,
          change: "N/A",
          period: "based on usage only",
        },

        // ❌ NOT AVAILABLE
        upgradeRate: {
          title: "Upgrade Rate",
          value: "N/A",
          change: "N/A",
          period: "vs last month",
        },

        downgradeRate: {
          title: "Downgrade Rate",
          value: "N/A",
          change: "N/A",
          period: "vs last month",
          changeNegativeIsGood: true,
        },

        // ❌ NOT AVAILABLE
        revenueTrend: {
          title: "Revenue Trend",
          subtitle: "MRR and ARR over time",
          months: defaultMonths,
          yLabels: [],
          max: 0,
          min: 0,
          filterOptions: ["MRR", "ARR (÷12)", "Both"],
          selectedFilter: "Both",
          series: [],
        },

        // ❌ NOT AVAILABLE
        revenueByPlan: {
          title: "Revenue by Plan",
          subtitle: "MRR contribution",
          total: 0,
          rows: [],
        },

        // ⚠️ PARTIAL (USAGE-BASED)
        conversionFunnel: {
          title: "Free → Paid Conversion Funnel",
          subheading: "User journey",
          rows: [
            {
              label: "Users",
              sublabel: `${totalUsers}`,
              percent: 100,
              display: "100%",
            },
            {
              label: "Active",
              sublabel: `${activeUsers}`,
              percent: totalUsers
                ? Math.round((activeUsers / totalUsers) * 100)
                : 0,
              display: `${totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0}%`,
            },
            {
              label: "High Usage (proxy)",
              sublabel: `${paidUsers}`,
              percent: freeToPaid,
              display: `${freeToPaid.toFixed(1)}%`,
            },
          ],
        },

        exportUsageByPlan: {
          title: "Export Usage by Plan",
          subtitle: "",
          legend: [],
          plans: [],
          max: 0,
          yLabels: [],
        },

        paywallEvents: {
          title: "Paywall Interaction Events",
          subtitle: "",
          events: [],
        },

        topRevenueUsers: {
          title: "Top Users by Revenue",
          subtitle: "",
          rows: topUsers,
        },
      };

      return res.json({
        status: "success",
        details: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: (error as Error).message,
      });
    }
  };

  /**
   * GET /api/admin/ai-performance
   */

  private getAiPerformance = async (req: AuthRequest, res: Response) => {
    try {
      const timeframeRaw = req.query.timeframe;
      const searchRaw = req.query.search;

      const timeframe =
        typeof timeframeRaw === "string" ? timeframeRaw : "Last 30d";

      const search = typeof searchRaw === "string" ? searchRaw : undefined;

      const timeframeMap: Record<string, number | null> = {
        "Last 7d": 7,
        "Last 30d": 30,
        "Last 90d": 90,
        "This year": 365,
        "All time": 999,
      };

      const days = timeframeMap[timeframe] ?? 30;

      const since = days
        ? new Date(Date.now() - days * 86400000).toISOString()
        : undefined;

      const jobs = await SupabaseDB.getAllJobs(since);

      const total = jobs.length;

      // =========================
      // STATUS COUNTS
      // =========================
      const success = jobs.filter((j) => j.status === "completed").length;
      const failed = jobs.filter((j) => j.status === "failed").length;
      const pending = jobs.filter((j) => j.status === "pending").length;

      const successRate = total > 0 ? (success / total) * 100 : 0;

      // =========================
      // LATENCY (APPROX FROM progress)
      // =========================
      const latencies = jobs
        .map((j) => j.progress)
        .filter((v) => typeof v === "number");

      const avgLatency =
        latencies.length > 0
          ? latencies.reduce((a, b) => a + b, 0) / latencies.length
          : 0;

      // =========================
      // REGENERATIONS (FAILURE PROXY)
      // =========================
      const regenCount = failed;
      const regenPerOutput = total > 0 ? regenCount / total : 0;

      // =========================
      // COMPLETION (REALISTIC)
      // =========================
      const completedPct = successRate;
      const pendingPct = total > 0 ? (pending / total) * 100 : 0;
      const failedPct = total > 0 ? (failed / total) * 100 : 0;

      // =========================
      // LATENCY SERIES
      // =========================
      const latencySeries = jobs
        .slice(0, 12)
        .map((j) => (typeof j.progress === "number" ? j.progress : 0));

      // =========================
      // ERROR LOGS
      // =========================
      const errorLogs = jobs
        .filter((j) => j.status === "failed")
        .slice(0, 5)
        .map((j, i) => ({
          id: `err-${i}`,
          severity: "Error",
          message: j.error_message || "Generation failed",
          timestamp: new Date(j.created_at).toUTCString(),
          model: "AI",
          tool: j.type || "unknown",
          detail: j.error || "N/A",
        }));

      // =========================
      // FINAL RESPONSE
      // =========================
      const data = {
        header: {
          title: "AI Performance",
          subtitle:
            "Measure AI output quality, prompt performance, error logs, and latency alerts.",
        },

        filters: {
          searchPlaceholder: "Search files, content, and tags...",
          options: {},
        },

        // =========================
        // OUTPUT METRICS
        // =========================
        outputMetrics: {
          cards: [
            {
              id: "acceptance",
              icon: "acceptance",
              title: "Output Acceptance Rate",
              value: `${successRate.toFixed(1)}%`,
              change: "N/A",
              period: "based on job success",
            },
            {
              id: "editAccept",
              icon: "editAccept",
              title: "Edit vs Accept Ratio",
              value: "N/A",
              change: "N/A",
              period: "no edit tracking",
            },
            {
              id: "regenerations",
              icon: "regenerations",
              title: "Regen per Output",
              value: `${regenPerOutput.toFixed(2)}×`,
              change: "N/A",
              period: "failure-based proxy",
            },
            {
              id: "latency",
              icon: "latency",
              title: "Avg Time to Generate",
              value: `${avgLatency.toFixed(1)}s`,
              change: "N/A",
              period: "approx from progress",
            },
          ],
        },

        // =========================
        // PROMPT SUCCESS
        // =========================
        promptSuccess: {
          title: "Prompt Success",
          success,
          failed,
          legend: [
            { label: "Success", color: "#8696b0" },
            { label: "Failed", color: "#18181b" },
          ],
        },

        // =========================
        // LATENCY TREND
        // =========================
        latencyTrend: {
          title: "Latency",
          filterOptions: ["Both"],
          selectedFilter: "Both",
          months: defaultMonths,
          yLabels: ["10", "8", "6", "4", "2", "0"],
          max: 10,
          series: [
            {
              label: "Latency",
              color: "#18181b",
              data: latencySeries,
            },
          ],
        },

        // =========================
        // REGENERATIONS
        // =========================
        regenerations: {
          title: "Regenerations",
          subtitle: `${regenCount} failure-based regenerations`,
          rows: [
            {
              label: "All",
              caption: "Failures used as proxy",
              value: regenCount.toString(),
            },
          ],
        },

        // ❌ NOT AVAILABLE
        aiFeedback: {
          title: "AI Feedback",
          xLabels: [],
          yLabels: [],
          max: 0,
          values: [],
        },

        // =========================
        // COMPLETION RATE
        // =========================
        completionRate: {
          title: "Prompt Completion Rate",
          filterOptions: ["Last 30d"],
          selectedFilter: "Last 30d",
          total: total,
          bars: [
            { label: "Completed", value: completedPct, color: "#18181b" },
            { label: "Pending", value: pendingPct, color: "#8696b0" },
            { label: "Failed", value: failedPct, color: "#e4e4e7" },
          ],
        },

        // =========================
        // LOGS
        // =========================
        aiLogs: {
          title: "AI Logs",
          errors: errorLogs,
          timeouts: [],
        },

        // =========================
        // ALERTS
        // =========================
        aiAlerts: {
          title: "Alerts",
          failureSpikes:
            failed > 10
              ? [
                  {
                    id: "fs-1",
                    title: "Failure spike detected",
                    severity: "Critical",
                    model: "AI",
                    description: "High failure rate detected",
                    metric: `${failed} failures`,
                    time: "recent",
                  },
                ]
              : [],
          latencyIssues:
            avgLatency > 8
              ? [
                  {
                    id: "lat-1",
                    title: "High latency detected",
                    severity: "Warning",
                    description: "Latency above normal threshold",
                    metric: `${avgLatency.toFixed(1)}s`,
                    time: "recent",
                  },
                ]
              : [],
        },

        // ❌ NOT AVAILABLE
        driftAlerts: {
          title: "Drift Alerts",
          alerts: [],
        },

        predictiveSignals: {
          highActivityCohorts: { cohorts: [] },
          churnRiskHeatmap: { rows: [] },
          aiFrustrationAlerts: { alerts: [] },
        },
      };

      return res.json({
        status: "success",
        details: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: (error as Error).message,
      });
    }
  };

  /**
   * GET /api/admin/platform-health
   */
  private getPlatformHealth = async (req: AuthRequest, res: Response) => {
    try {
      const timeframeRaw = req.query.timeframe;
      const searchRaw = req.query.search;

      const timeframe =
        typeof timeframeRaw === "string" ? timeframeRaw : "Last 30d";

      const search = typeof searchRaw === "string" ? searchRaw : undefined;

      const timeframeMap: Record<string, number | null> = {
        "Last 7d": 7,
        "Last 30d": 30,
        "Last 90d": 90,
        "This year": 365,
        "All time": 999,
      };

      const days = timeframeMap[timeframe] ?? 30;

      const since = days
        ? new Date(Date.now() - days * 86400000).toISOString()
        : undefined;

      const jobs = await SupabaseDB.getAllJobs(since);

      const total = jobs.length;

      const failed = jobs.filter((j) => j.status === "failed").length;
      const timeout = jobs.filter((j) => j.status === "timeout").length;

      const errorRate = total > 0 ? (failed / total) * 100 : 0;
      const timeoutRate = total > 0 ? (timeout / total) * 100 : 0;

      // =========================
      // LATENCY (APPROX FROM progress)
      // =========================
      const latencies = jobs
        .map((j) => j.progress)
        .filter((v) => typeof v === "number");

      const avgLatency =
        latencies.length > 0
          ? latencies.reduce((a, b) => a + b, 0) / latencies.length
          : 0;

      // =========================
      // ENDPOINT AGGREGATION
      // =========================
      const endpointMap = new Map<string, any>();

      jobs.forEach((j: any) => {
        const key = j.type || "unknown";

        if (!endpointMap.has(key)) {
          endpointMap.set(key, {
            endpoint: key,
            calls: 0,
            errors: 0,
            latencies: [],
          });
        }

        const entry = endpointMap.get(key);

        entry.calls++;
        entry.latencies.push(typeof j.progress === "number" ? j.progress : 0);

        if (j.status === "failed") {
          entry.errors++;
        }
      });

      const percentile = (arr: number[], p: number) => {
        if (!arr.length) return 0;
        const sorted = [...arr].sort((a, b) => a - b);
        const idx = Math.floor((p / 100) * sorted.length);
        return sorted[idx] || 0;
      };

      const endpointRows = Array.from(endpointMap.values()).map((val, i) => ({
        id: `ep-${i}`,
        endpoint: val.endpoint,
        method: "POST",
        p50: percentile(val.latencies, 50),
        p95: percentile(val.latencies, 95),
        p99: percentile(val.latencies, 99),
        errorRate: val.calls ? (val.errors / val.calls) * 100 : 0,
        callsPerHour: val.calls, // ⚠️ approximation
        status: val.errors > 5 ? "degraded" : "healthy",
      }));

      // =========================
      // API PERCENTILES
      // =========================
      const p50 = percentile(latencies, 50);
      const p95 = percentile(latencies, 95);
      const p99 = percentile(latencies, 99);

      // =========================
      // FINAL RESPONSE
      // =========================
      const data = {
        header: {
          title: "Platform Health",
          subtitle:
            "Engineering and reliability visibility — API performance, queues, logs, and real-time alerts.",
        },

        apiPercentiles: {
          title: "API Response Time",
          p50,
          p95,
          p99,
          status: errorRate > 1 ? "warning" : "healthy",
          statusLabel: errorRate > 1 ? "Elevated" : "Healthy",
          period: "Based on job latency (approx)",
        },

        errorRate: {
          title: "Error Rate",
          value: `${errorRate.toFixed(2)}%`,
          change: "N/A",
          period: "based on jobs",
          status: errorRate > 1 ? "warning" : "healthy",
          statusLabel: errorRate > 1 ? "Elevated" : "Normal",
        },

        timeoutRate: {
          title: "Timeout Rate",
          value: `${timeoutRate.toFixed(2)}%`,
          change: "N/A",
          period: "based on jobs",
          status: timeoutRate > 1 ? "warning" : "healthy",
          statusLabel: timeoutRate > 1 ? "Elevated" : "Normal",
        },

        // ❌ NOT TRUE UPTIME
        uptime: {
          title: "Uptime (30d)",
          value: "N/A",
          change: "N/A",
          period: "requires infra monitoring",
          status: "healthy",
          statusLabel: "Unknown",
        },

        endpointPerformance: {
          title: "Endpoint Performance",
          rows: endpointRows,
        },

        // ⚠️ APPROX ONLY
        monitoring: {
          queue: {
            title: "Queue Delays",
            value: avgLatency.toFixed(1),
            unit: "ms",
            status: "unknown",
            statusLabel: "Approx",
            period: "derived from job latency",
            subRows: [],
          },
          exports: {
            title: "Export Processing Time",
            value: avgLatency.toFixed(1),
            unit: "ms",
            status: "unknown",
            statusLabel: "Approx",
            period: "no export tracking",
            subRows: [],
          },
        },

        systemLogs: {
          title: "System Logs",
          incidents: jobs
            .filter((j) => j.status === "failed")
            .slice(0, 3)
            .map((j, i) => ({
              id: `inc-${i}`,
              title: j.error_message || "Failure",
              severity: "High",
              status: "Active",
              service: j.type || "AI",
              timestamp: new Date(j.created_at).toUTCString(),
              duration: "N/A",
              detail: j.error || "Unknown error",
            })),
          deploys: [],
          releases: [],
        },

        realtimeAlerts: {
          title: "Real-Time System Alerts",
          alerts:
            failed > 5
              ? [
                  {
                    id: "rta-1",
                    title: "Failure spike detected",
                    severity: "Critical",
                    status: "Active",
                    service: "AI",
                    timestamp: "Now",
                    description: "High failure rate",
                    metric: `${failed} failures`,
                  },
                ]
              : [],
        },

        failuresAlerts: {
          title: "Failures & Alerts",
          subtitle: "Recent incidents",
          alerts: jobs
            .filter((j) => j.status === "failed")
            .slice(0, 5)
            .map((j, i) => ({
              id: `alert-${i}`,
              service: j.type || "AI",
              title: j.error_message || "Failure",
              severity: "High",
              status: "Active",
              timestamp: new Date(j.created_at).toUTCString(),
              description: j.error || "Unknown error",
            })),
        },
      };

      return res.json({
        status: "success",
        details: data,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: (err as Error).message,
      });
    }
  };
}
