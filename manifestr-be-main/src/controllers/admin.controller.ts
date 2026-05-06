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

function parseAdminAudienceQuery(req: AuthRequest) {
  const cohort =
    typeof req.query.cohort === "string" ? req.query.cohort : "All cohorts";
  const persona =
    typeof req.query.persona === "string" ? req.query.persona : "All personas";
  const device =
    typeof req.query.device === "string" ? req.query.device : "All devices";
  return { cohort, persona, device };
}

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

      const { cohort, persona, device } = parseAdminAudienceQuery(req);
      const audienceUserIds = await SupabaseDB.resolveAdminAudienceUserIds({
        sinceIso: since,
        days,
        cohort,
        persona,
        device,
      });

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
        weeklyCreators,
      ] = await Promise.all([
        SupabaseDB.getUsersCount(since, search, audienceUserIds),

        SupabaseDB.getNewUsersLastDays(days, audienceUserIds),
        SupabaseDB.getNewUsersPreviousDays(days, audienceUserIds),

        SupabaseDB.getUserGrowthMonthly(since, audienceUserIds),

        SupabaseDB.getRecentUsers(5, since, audienceUserIds),

        SupabaseDB.getDAU(since, audienceUserIds),
        SupabaseDB.getMAU(since, audienceUserIds),

        SupabaseDB.getActivatedUsersCount(since, audienceUserIds),

        SupabaseDB.getTotalJobsCount(since, audienceUserIds),
        SupabaseDB.getFailedJobsCount(since, audienceUserIds),

        SupabaseDB.getWeeklyActiveCreatorsComparison(audienceUserIds),
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

      const wauCurrent = weeklyCreators.currentWindow;
      const wauPrevious = weeklyCreators.previousWindow;
      const jobsEver = weeklyCreators.jobsEver;

      /** Product engagement proxy — not subscription churn (billing not integrated). */
      const churnAlerts =
        jobsEver === 0
          ? [
              {
                id: "churn-1",
                title: "No Activity Baseline Yet",
                description:
                  "Churn trends will appear once users run generations.",
                severity: "info",
                time: "now",
              },
            ]
          : wauPrevious === 0 && wauCurrent === 0
            ? [
                {
                  id: "churn-1",
                  title: "No Recent Generation Activity",
                  description:
                    "No active creators in the last 14 days — check product health.",
                  severity: "warning",
                  time: "now",
                },
              ]
            : wauPrevious === 0
              ? [
                  {
                    id: "churn-1",
                    title: "Activity Baseline Forming",
                    description: `${wauCurrent} active creator${
                      wauCurrent === 1 ? "" : "s"
                    } in the last 7 days.`,
                    severity: "info",
                    time: "now",
                  },
                ]
              : (() => {
                  const dropPct =
                    ((wauPrevious - wauCurrent) / wauPrevious) * 100;
                  if (dropPct >= 30) {
                    return [
                      {
                        id: "churn-1",
                        title: "Weekly Active Creators Dropped",
                        description: `Down ${dropPct.toFixed(
                          0,
                        )}% vs the prior 7 days (${wauCurrent} vs ${wauPrevious}).`,
                        severity: "warning",
                        time: "now",
                      },
                    ];
                  }
                  return [
                    {
                      id: "churn-1",
                      title: "No Churn Spike",
                      description: `Weekly active creators: ${wauCurrent} (previous 7d: ${wauPrevious}).`,
                      severity: "info",
                      time: "now",
                    },
                  ];
                })();

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

      const getPeriodLabel = (timeframe: string) => {
        if (timeframe === "Last 7d") return "vs prev 7d";
        if (timeframe === "Last 30d") return "vs last 30d";
        if (timeframe === "Last 90d") return "vs last 90d";
        return `vs ${timeframe}`;
      };

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
              change: totalUsersChange,
              period: getPeriodLabel(timeframe),
            },
            {
              title: `New Signups (${days}d)`,
              value: newUsers?.toLocaleString() || "0",
              change: signupChange,
              period: getPeriodLabel(timeframe),
            },
            {
              title: "DAU / MAU",
              value: dauMau,
              change: "0%",
              period: getPeriodLabel(timeframe),
            },
          ],
          [
            {
              title: "Activation Rate",
              value: activationRate,
              change: "0%",
              period: getPeriodLabel(timeframe),
            },
            {
              title: "MRR (Monthly Recurring Revenue)",
              value: "$0",
              change: "0%",
              period: "no billing data",
            },
            {
              title: "Revenue This Month",
              value: "$0",
              change: "0%",
              period: "no billing data",
            },
          ],
        ],

        // =========================
        // USER GROWTH
        // =========================
        userGrowth: {
          title: "User Growth",
          filterOptions: ["last 7d", "last 30d", "last 90d", "all time"],
          selectedFilter: timeframe.toLowerCase(),
          months,
          series,
          max: Math.max(...series, 1),
          change: growthChange,
          period: getPeriodLabel(timeframe),
          valueUnit: "count",
          primaryMetric: "lastCount",
          headlineValue: series.length ? series[series.length - 1] : 0,
        },

        // =========================
        // REVENUE (ZERO SAFE)
        // =========================
        revenueTrend: {
          title: "Revenue Trend",
          filterOptions: ["Both", "MRR", "ARR"],
          selectedFilter: "Both",
          months: defaultMonths,
          yLabels: ["80K", "60K", "40K", "20K", "10K", "0"],
          mrrData: Array(12).fill(0),
          arrData: Array(12).fill(0),
          mrrDollar: Array(12).fill("$0"),
          arrDollar: Array(12).fill("$0"),
          max: 0,
          change: "0%",
          period: "MoM",
        },

        // =========================
        // FUNNEL
        // =========================
        conversionFunnel: {
          title: "Conversion Funnel",
          steps: [
            {
              label: "Users",
              value: totalUsers,
              valueLabel: totalUsers.toLocaleString(),
            },
            {
              label: "Signups",
              value: newUsers,
              valueLabel: newUsers.toLocaleString(),
            },
            {
              label: "Activated",
              value: activatedUsers,
              valueLabel: activatedUsers.toLocaleString(),
            },
            { label: "Paying", value: 0, valueLabel: "0" },
            { label: "Retained (90d)", value: 0, valueLabel: "0" },
          ],
        },

        // =========================
        // ACTIVITY (IMPROVED)
        // =========================
        recentActivity: {
          title: "Recent Activity",
          events:
            recentUsers?.map((u, i) => ({
              id: `ev-${i}`,
              type: "signup",
              actor: u.email,
              description: `New signup`,
              time: new Date(u.created_at).toLocaleDateString(),
            })) || [],
        },

        // =========================
        // ALERTS (IMPROVED)
        // =========================
        alerts: {
          title: "Alerts",

          system: [
            {
              id: "sys-1",
              title:
                failureRate !== "0%"
                  ? "High Failure Rate Detected"
                  : "System Stable",
              description:
                failureRate !== "0%"
                  ? `Failure rate is ${failureRate}`
                  : "No major issues detected",
              severity: failureRate !== "0%" ? "warning" : "info",
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

          churn: churnAlerts,
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
      const parseSignupsChartRange = (
        raw: unknown,
      ):
        | "last_7d"
        | "last_30d"
        | "last_90d"
        | "all_time" => {
        const s = String(raw ?? "")
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "_")
          .replace(/-/g, "_");
        if (s === "last_7d") return "last_7d";
        if (s === "last_30d") return "last_30d";
        if (s === "last_90d") return "last_90d";
        if (s === "all_time" || s === "alltime") return "all_time";
        return "last_30d";
      };

      /** Same buckets as signups; coerces `all_time` → last 90d (no all-time bar chart). */
      const parseReturningChartRange = (
        raw: unknown,
      ): "last_7d" | "last_30d" | "last_90d" => {
        const r = parseSignupsChartRange(raw);
        if (r === "all_time") return "last_90d";
        return r;
      };

      const chartRangeToUi = (
        r: "last_7d" | "last_30d" | "last_90d" | "all_time",
      ) => {
        const m: Record<string, string> = {
          last_7d: "last 7d",
          last_30d: "last 30d",
          last_90d: "last 90d",
          all_time: "all time",
        };
        return m[r] ?? "last 30d";
      };

      const timeframeRaw = req.query.timeframe;
      const searchRaw = req.query.search;

      const timeframe =
        typeof timeframeRaw === "string" ? timeframeRaw : "Last 30d";

      const search = typeof searchRaw === "string" ? searchRaw : undefined;

      const signupsChartRange = parseSignupsChartRange(
        req.query.signupsChartRange,
      );
      const returningChartRange = parseReturningChartRange(
        req.query.returningChartRange,
      );

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

      const { cohort, persona, device } = parseAdminAudienceQuery(req);
      const audienceUserIds = await SupabaseDB.resolveAdminAudienceUserIds({
        sinceIso: since,
        days,
        cohort,
        persona,
        device,
      });

      const [
        totalUsers,
        newUsers30d,
        newUsersPrev30d,
        dau,
        mau,
        signupsRolling,
        returningVsNew,
        healthAndPower,
        regionValues,
        sourceBreakdown,
        activatedUsers,
        returningSharePct,
      ] = await Promise.all([
        SupabaseDB.getUsersCount(since, search, audienceUserIds),
        SupabaseDB.getNewUsersLastDays(days, audienceUserIds),
        SupabaseDB.getNewUsersPreviousDays(days, audienceUserIds),

        SupabaseDB.getDAU(since, audienceUserIds),
        SupabaseDB.getMAU(since, audienceUserIds),

        SupabaseDB.getSignupsSeriesForChartRange(signupsChartRange),
        SupabaseDB.getReturningVsNewForChartRange(returningChartRange),

        SupabaseDB.getHealthMetricsAndPowerUsers(since, audienceUserIds),
        SupabaseDB.getUsersByRegion(since, audienceUserIds),
        SupabaseDB.getSignupSourceBreakdown(since),

        SupabaseDB.getActivatedUsersCount(since, audienceUserIds),

        SupabaseDB.getReturningSharePct(days),
      ]);

      const healthMetrics = healthAndPower.healthMetrics;
      const topUsers = healthAndPower.powerUsers;

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

      const months = signupsRolling?.labels?.length
        ? signupsRolling.labels
        : defaultMonths;

      const signupSeries = signupsRolling?.values?.length
        ? signupsRolling.values
        : Array(12).fill(0);

      const returning = returningVsNew?.returning || Array(12).fill(0);
      const newUsersSeries = returningVsNew?.newUsers || Array(12).fill(0);
      const barLabels = returningVsNew?.labels?.length
        ? returningVsNew.labels
        : defaultMonths;

      // -------------------------
      // Response
      // -------------------------

      const zero12 = Array(12).fill(0);

      const formatPct = (v: string | number) => `${v}%`;

      const chartMax = Math.max(
        ...signupSeries,
        ...returning,
        ...newUsersSeries,
        1,
      );
      const ySteps = 5;
      const yCeil = Math.max(Math.ceil(chartMax / 100) * 100, 10);
      const yTick = yCeil / ySteps;
      const returningYLabels = Array.from({ length: ySteps + 1 }, (_, i) =>
        String(Math.round((ySteps - i) * yTick)),
      );

      const signupChangeNum = parseFloat(String(signupChange)) || 0;
      const changeVariant =
        signupChangeNum > 0
          ? "positive"
          : signupChangeNum < 0
            ? "negative"
            : "neutral";

      const pctShareAxis = (values: number[]) => {
        const peak = Math.max(...values, 0);
        const cap = Math.max(10, Math.ceil(peak / 10) * 10);
        const steps = 5;
        const tick = cap / steps;
        const yLabels = Array.from({ length: steps + 1 }, (_, i) =>
          `${Math.round((steps - i) * tick)}%`,
        );
        return { max: cap, yLabels };
      };

      const regionVals = regionValues || [0, 0, 0, 0];
      const sourceVals = sourceBreakdown || [0, 0, 0, 0];
      const regionAxis = pctShareAxis(regionVals);
      const sourceAxis = pctShareAxis(sourceVals);

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
            Cohort: ["All cohorts", "New users", "Returning", "Power users"],
            Persona: ["All personas", "Freelancer", "Agency", "Enterprise"],
            Device: ["All devices", "Desktop", "Mobile", "Tablet"],
          },
        },

        // =========================
        // STATS
        // =========================
        stats: [
          {
            title: `New Signups (${days}d)`,
            value: newUsers30d?.toLocaleString() || "0",
            change: formatPct(signupChange),
            period: `vs last ${days}d`,
          },
          {
            title: "Activation Rate",
            value: `${activationRate}%`,
            change: "0%",
            period: `vs last ${days}d`,
          },
          {
            title: "DAU / MAU",
            value: `${dauMau}%`,
            change: "0%",
            period: `vs last ${days}d`,
          },
          {
            title: "Returning Users",
            value: `${returningSharePct}%`,
            change: "0%",
            period: `vs last ${days}d`,
          },
        ],

        // =========================
        // SIGNUPS
        // =========================
        signupsOverTime: {
          title: "Signups Over Time",
          filterOptions: ["last 7d", "last 30d", "last 90d", "all time"],
          selectedFilter: chartRangeToUi(signupsChartRange),
          months,
          series: signupSeries,
          max: Math.max(...signupSeries, 1),
          change: formatPct(signupChange),
          period: `vs last ${days}d`,
          valueUnit: "count",
          changeVariant,
          /** Bold headline: signup growth vs prior period (chart stays monthly counts). */
          primaryMetric: "growth",
          headlinePercent: formatPct(signupChange),
          headlineValue:
            signupSeries.length > 0
              ? signupSeries[signupSeries.length - 1]
              : 0,
        },

        // =========================
        // RETURNING VS NEW
        // =========================
        returningVsNew: {
          title: "Returning vs New Users",
          filterOptions: ["last 7d", "last 30d", "last 90d"],
          selectedFilter: chartRangeToUi(returningChartRange),
          months: barLabels,
          yLabels: returningYLabels,
          returning,
          newUsers: newUsersSeries,
          max: chartMax,
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
          values: regionVals,
          max: regionAxis.max,
          yLabels: regionAxis.yLabels,
          footer: "Share of users (%)",
          valueFormat: "percent",
        },

        // =========================
        // SOURCE (analytics_events signup UTMs)
        // =========================
        breakdownBySource: {
          title: "By Source",
          xLabels: ["Organic", "Paid Search", "Referral", "Direct"],
          values: sourceVals,
          max: sourceAxis.max,
          yLabels: sourceAxis.yLabels,
          footer: "Share of users (%)",
          valueFormat: "percent",
        },

        // =========================
        // USER TYPE
        // =========================
        breakdownByUserType: {
          title: "By User Type",
          returningPct: returningSharePct,
          newPct: Math.min(100, Math.max(0, 100 - returningSharePct)),
          organic: returningSharePct,
          paid: Math.min(100, Math.max(0, 100 - returningSharePct)),
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
          averageScore: healthMetrics?.averageScore ?? 0,
          distribution: healthMetrics?.distribution ?? {
            green: { label: "Healthy", range: "≥70", count: 0, pct: 0 },
            amber: { label: "At Risk", range: "40–69", count: 0, pct: 0 },
            red: { label: "Critical", range: "<40", count: 0, pct: 0 },
          },
          weights: [
            { label: "Session Frequency", weight: 0.35 },
            { label: "Outputs Created", weight: 0.3 },
            { label: "Recency", weight: 0.2 },
            { label: "Feature Usage", weight: 0.15 },
          ],
        },

        // =========================
        // POWER USERS
        // =========================
        powerUsers: {
          title: "Power Users",
          subtitle: "Top 10% most active users this month",
          rows: topUsers || [],
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

      const now = Date.now();
      const churnPrevSinceIso = new Date(
        now - 2 * (days || 30) * 86400000,
      ).toISOString();

      const [
        users,
        jobs,
        reactivation,
        churnSeries,
        churnWindowJobs,
      ] = await Promise.all([
        SupabaseDB.getAllUsers(since),
        SupabaseDB.getAllJobs(since),
        SupabaseDB.getReactivationRate(days || 30),
        SupabaseDB.getMonthlyCustomerChurnSeries(),
        SupabaseDB.getAllJobs(churnPrevSinceIso),
      ]);

      const totalUsers = users.length;

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
      // CHURNED USER IDs (active in [now-2d, now-d], inactive in [now-d, now])
      // =========================
      const windowStart = now - (days || 30) * 86400000;
      const prevWindowStart = now - 2 * (days || 30) * 86400000;

      const activeIdsCurrent = new Set<string>();
      const activeIdsPrev = new Set<string>();
      (churnWindowJobs || []).forEach((j: any) => {
        const t = new Date(j.created_at).getTime();
        const uid = j.user_id as string;
        if (!uid) return;
        if (t >= windowStart && t <= now) activeIdsCurrent.add(uid);
        else if (t >= prevWindowStart && t < windowStart)
          activeIdsPrev.add(uid);
      });

      const churnedUserIds: string[] = [];
      activeIdsPrev.forEach((uid) => {
        if (!activeIdsCurrent.has(uid)) churnedUserIds.push(uid);
      });

      // Pull churned user records (they may pre-date `since`)
      const churnedUsers = await SupabaseDB.getUsersBasicById(churnedUserIds);

      const churnSourceRows = await SupabaseDB.getChurnedUserSourceMix(
        churnedUserIds,
      );

      // =========================
      // BY PLAN (users.tier)
      // =========================
      const planLabel = (t?: string | null) => {
        const v = (t || "").toLowerCase().trim();
        if (v === "free" || v === "starter") return "Starter";
        if (v === "pro") return "Pro";
        if (v === "enterprise") return "Enterprise";
        return "Other";
      };
      const planBuckets: Record<string, number> = {};
      churnedUsers.forEach((u: any) => {
        const k = planLabel(u.tier);
        planBuckets[k] = (planBuckets[k] || 0) + 1;
      });
      const planTotal = Object.values(planBuckets).reduce((a, b) => a + b, 0);
      const byPlanRows =
        planTotal > 0
          ? Object.entries(planBuckets)
              .map(([label, count]) => ({
                label,
                value: Math.round((count / planTotal) * 100),
              }))
              .sort((a, b) => b.value - a.value)
          : [
              { label: "Starter", value: 0 },
              { label: "Pro", value: 0 },
              { label: "Enterprise", value: 0 },
            ];

      // =========================
      // BY REGION proxy (users.country)
      // =========================
      const regionBuckets: Record<string, number> = {
        "N. America": 0,
        Europe: 0,
        Asia: 0,
        Other: 0,
      };
      churnedUsers.forEach((u: any) => {
        const k = SupabaseDB.regionFromCountry(u.country);
        regionBuckets[k]++;
      });
      const regionTotal = Object.values(regionBuckets).reduce(
        (a, b) => a + b,
        0,
      );
      const byRegionRows = (
        ["N. America", "Europe", "Asia", "Other"] as const
      ).map((label) => ({
        label,
        value:
          regionTotal > 0
            ? Math.round((regionBuckets[label] / regionTotal) * 100)
            : 0,
      }));

      // =========================
      // CHURN TREND axis scaling
      // =========================
      const churnSeriesMax = Math.max(...(churnSeries.values || [0]), 0);
      const churnAxisMax = Math.max(6, Math.ceil(churnSeriesMax / 5) * 5);
      const churnYStep = churnAxisMax / 6;
      const churnYLabels = Array.from({ length: 7 }, (_, i) =>
        `${Math.round((6 - i) * churnYStep)}%`,
      );

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

      const formatPct = (v: number) => `${v}%`;

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
            value: formatPct(churnRate || 0),
            change: "0%",
            period: `vs last ${days}d`,
          },
          {
            id: "reactivationRate",
            title: "Reactivation Rate",
            value: `${reactivation?.rate ?? 0}%`,
            change: "0%",
            period: `vs last ${days}d`,
          },
          {
            id: "avgRetention",
            title: "Avg Retention (30d)",
            value: formatPct(avgRetention || 0),
            change: "0%",
            period: `vs last ${days}d`,
          },
          {
            id: "churnedAccounts",
            title: "Churned This Month",
            value: churnedAccounts?.toLocaleString() || "0",
            change: "0",
            period: "vs last month",
          },
        ],

        // =========================
        // COHORT TABLE (REAL)
        // =========================
        cohortRetention: {
          title: "Cohort Retention",
          subtitle:
            "Share of users retained 1 day, 7 days, and 30 days after sign-up.",
          periods: ["1d", "7d", "30d"],
          rows:
            cohortRows?.length > 0
              ? cohortRows.map((r) => ({
                  cohort: r.cohort,
                  size: `${parseInt(r.size).toLocaleString()} users`,
                  values: r.values,
                }))
              : [
                  {
                    cohort: "No data",
                    size: "0 users",
                    values: [0, 0, 0],
                  },
                ],
        },

        // =========================
        // RETENTION CURVE (DERIVED)
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
            {
              label: "Day 1",
              color: "#18181b",
              data: cohortRows?.map((r) => r.values[0]) || Array(12).fill(0),
            },
            {
              label: "Day 7",
              color: "#52525b",
              data: cohortRows?.map((r) => r.values[1]) || Array(12).fill(0),
            },
            {
              label: "Day 30",
              color: "#a1a1aa",
              data: cohortRows?.map((r) => r.values[2]) || Array(12).fill(0),
            },
          ],
        },

        // =========================
        // CHURN TREND (real customer churn; revenue churn left at 0 — no billing)
        // =========================
        churnRateTrend: {
          title: "Churn Trend",
          filterOptions: ["Both", "Customer Churn", "Revenue Churn"],
          months: churnSeries?.months?.length
            ? churnSeries.months
            : defaultMonths,
          yLabels: churnYLabels,
          max: churnAxisMax,
          min: 0,
          series: [
            {
              label: "Customer Churn",
              color: "#18181b",
              data: churnSeries?.values?.length
                ? churnSeries.values
                : Array(12).fill(0),
            },
            {
              label: "Revenue Churn",
              color: "#8696b0",
              data: Array(12).fill(0),
            },
          ],
        },

        // =========================
        // REVENUE RETENTION (ZERO SAFE)
        // =========================
        revenueRetention: {
          title: "Revenue Retention",
          metrics: [
            {
              id: "nrr",
              title: "NRR",
              value: "0%",
              change: "0%",
              period: `vs last ${days}d`,
            },
            {
              id: "grr",
              title: "GRR",
              value: "0%",
              change: "0%",
              period: `vs last ${days}d`,
            },
            {
              id: "expansion",
              title: "Expansion Revenue",
              value: "$0",
              change: "0%",
              period: `vs last ${days}d`,
            },
            {
              id: "contraction",
              title: "Contraction Revenue",
              value: "$0",
              change: "0%",
              period: `vs last ${days}d`,
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
            { label: "NRR", color: "#18181b", data: Array(12).fill(0) },
            { label: "GRR", color: "#8696b0", data: Array(12).fill(0) },
          ],
        },

        // =========================
        // CHURN ANALYSIS (real where data exists)
        // =========================
        churnAnalysis: {
          title: "Churn Analysis",
          byPlan: {
            title: "By Plan",
            rows: byPlanRows,
          },
          bySegment: {
            title: "By Region",
            rows: byRegionRows,
          },
          bySource: {
            title: "By Source",
            rows: churnSourceRows,
          },
        },

        // =========================
        // CHURN REASONS (no exit-survey data tracked yet)
        // =========================
        churnReasons: {
          title: "Churn Reasons",
          subtitle: `${churnedAccounts || 0} churned accounts`,
          segments: [
            {
              label: "Not tracked yet",
              value: 100,
              color: "#e4e4e7",
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

      const analytics = await SupabaseDB.getLifecycleAnalytics(
        days,
        search,
        timeframe,
      );

      const stages = analytics.stages;
      const lifecycleStages = analytics.stageCards;
      const totalUsers = analytics.totalUsers;
      const segmentByKey = new Map(
        analytics.segmentDetail.map((d) => [d.key, d]),
      );

      const calcChange = (current: number, previous: number) => {
        if (!previous || previous === 0) return "0%";

        const change = ((current - previous) / previous) * 100;
        const sign = change > 0 ? "+" : "";

        return `${sign}${change.toFixed(1)}%`;
      };

      const periodLabel =
        timeframe === "All time"
          ? "vs prior period"
          : timeframe === "Last 7d"
            ? "vs prior 7d"
            : `vs prior ${days}d`;

      const engagedPower = stages.engaged + stages.power_user;

      const formatNumber = (n: number) => n.toLocaleString();

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
            Role: ["All roles", "Founder", "Operator", "Investor"],
            Cohort: ["All cohorts", "New users", "Returning", "Power users"],
            Persona: ["All personas", "Freelancer", "Agency", "Enterprise"],
            Device: ["All devices", "Desktop", "Mobile", "Tablet"],
          },
        },

        // =========================
        // STATS
        // =========================
        stats: [
          {
            id: "total",
            title: "Total Users",
            value: formatNumber(totalUsers),
            change: calcChange(totalUsers, analytics.prev.totalUsers),
            period: periodLabel,
          },
          {
            id: "engaged",
            title: "Engaged + Power",
            value: formatNumber(engagedPower),
            change: calcChange(engagedPower, analytics.prev.engagedPower),
            period: periodLabel,
          },
          {
            id: "atRisk",
            title: "At Risk",
            value: formatNumber(stages.at_risk),
            change: calcChange(stages.at_risk, analytics.prev.atRisk),
            period: periodLabel,
          },
          {
            id: "reactivated",
            title: "Reactivated (30d)",
            value: formatNumber(stages.reactivated),
            change: calcChange(stages.reactivated, analytics.prev.reactivated),
            period: periodLabel,
          },
        ],

        // =========================
        // LIFECYCLE STAGES
        // =========================
        lifecycleStages: {
          title: "Lifecycle Stages",
          subtitle: "Distribution of users across all 8 lifecycle stages.",
          total: totalUsers,
          stages: lifecycleStages,
        },

        // =========================
        // SEGMENTS (FIXED)
        // =========================
        segments: {
          title: "Lifecycle Segments",
          subtitle:
            "Per-stage metrics and action triggers for every user group.",

          rows: lifecycleStages.map((s) => {
            const config = {
              new: {
                name: "New Signups",
                desc: "Signed up recently",
                actions: [
                  { label: "Trigger Onboarding", intent: "onboarding" },
                ],
              },
              activated: {
                name: "Activated Users",
                desc: "Completed first action",
                actions: [
                  { label: "Trigger Onboarding", intent: "onboarding" },
                  { label: "Trigger Upgrade Prompt", intent: "upgrade" },
                ],
              },
              engaged: {
                name: "Engaged Users",
                desc: "Active users",
                actions: [
                  { label: "Trigger Upgrade Prompt", intent: "upgrade" },
                ],
              },
              power_user: {
                name: "Power Users",
                desc: "Highly active users",
                actions: [
                  { label: "Trigger Upgrade Prompt", intent: "upgrade" },
                ],
              },
              at_risk: {
                name: "At-Risk Users",
                desc: "Usage declining",
                actions: [
                  { label: "Send Retention Email", intent: "retention-email" },
                  { label: "Trigger Win-back", intent: "win-back" },
                ],
              },
              dormant: {
                name: "Dormant Users",
                desc: "No activity recently",
                actions: [
                  { label: "Trigger Win-back", intent: "win-back" },
                  { label: "Send Retention Email", intent: "retention-email" },
                ],
              },
              churned: {
                name: "Churned Users",
                desc: "Lost users",
                actions: [{ label: "Trigger Win-back", intent: "win-back" }],
              },
              reactivated: {
                name: "Reactivated Users",
                desc: "Returned users",
                actions: [
                  { label: "Send Retention Email", intent: "retention-email" },
                  { label: "Trigger Upgrade Prompt", intent: "upgrade" },
                ],
              },
            } as any;

            const meta = config[s.key] || {};
            const seg = segmentByKey.get(s.key);

            return {
              id: s.key,
              stage: s.key,
              stageLabel: s.label,
              name: meta.name || s.label,
              description: meta.desc || "",
              users: formatNumber(s.value),

              avgOutputs: seg?.avgOutputs ?? "0",
              revenueValue: "$0",
              lastActivity: seg?.lastActivity ?? "—",

              actions: meta.actions || [],
            };
          }),
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

      const [kpiWindows, jobs, chartSeries, behaviourData, engagementExtras, deckFunnelExtras] =
        await Promise.all([
          SupabaseDB.getProductUsageCoreKpis(days),
          SupabaseDB.getAllJobs(since),
          SupabaseDB.getProductUsageChartSeries(),
          SupabaseDB.getProductUsageBehaviourData(days),
          SupabaseDB.getProductUsageEngagementExtras(since),
          SupabaseDB.getProductUsageDeckFunnelExtras({ since, days }),
        ]);

      const curKpi = kpiWindows.current;
      const prevKpi = kpiWindows.previous;
      const curB = behaviourData.current;
      const prevB = behaviourData.previous;

      const periodLabel =
        timeframe === "Last 7d" ? "vs prior 7d" : `vs prior ${days}d`;

      const pctChange = (current: number, previous: number) => {
        if (!Number.isFinite(previous) || previous === 0) return "0%";
        const ch = ((current - previous) / previous) * 100;
        const sign = ch > 0 ? "+" : "";
        return `${sign}${ch.toFixed(1)}%`;
      };

      const durLabel =
        curKpi.avgDurMin < 1
          ? `${Math.max(0, Math.round(curKpi.avgDurMin * 10) / 10)} min`
          : `${Math.round(curKpi.avgDurMin)} min`;

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
          subtitle:
            "Track how users interact with Manifestr tools — outputs, sessions, and journeys.",
        },

        filters: {
          searchPlaceholder: "Search tools, users, document types...",
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
        // KPIs
        // =========================
        stats: [
          {
            id: "outputs-per-user",
            title: "Outputs per User",
            value: curKpi.outputsPerUser.toFixed(2),
            change: pctChange(curKpi.outputsPerUser, prevKpi.outputsPerUser),
            period: periodLabel,
          },
          {
            id: "time-to-first-output",
            title: "Time to First Output",
            value: `${curKpi.avgTimeToFirst.toFixed(1)} hrs`,
            change: pctChange(curKpi.avgTimeToFirst, prevKpi.avgTimeToFirst),
            period: periodLabel,
          },
          {
            id: "session-frequency",
            title: "Session Frequency",
            value: `${curKpi.sessionFreqPerMo.toFixed(1)} / mo`,
            change: pctChange(
              curKpi.sessionFreqPerMo,
              prevKpi.sessionFreqPerMo,
            ),
            period: periodLabel,
          },
          {
            id: "avg-session-duration",
            title: "Avg Session Duration",
            value: durLabel,
            change: pctChange(curKpi.avgDurMin, prevKpi.avgDurMin),
            period: periodLabel,
          },
          {
            id: "completion-rate",
            title: "Completion Rate",
            value: `${curKpi.completionRate.toFixed(0)}%`,
            change: pctChange(
              curKpi.completionRate,
              prevKpi.completionRate,
            ),
            period: periodLabel,
          },
          {
            id: "abandonment-rate",
            title: "Abandonment Rate",
            value: `${curKpi.abandonmentRate.toFixed(0)}%`,
            change: pctChange(
              curKpi.abandonmentRate,
              prevKpi.abandonmentRate,
            ),
            period: periodLabel,
          },
        ],

        behaviourStats: [
          {
            id: "behaviour-rewrites-per-output",
            title: "Rewrites per Output",
            value:
              curB.rewritesPerOutput >= 10
                ? curB.rewritesPerOutput.toFixed(1)
                : curB.rewritesPerOutput.toFixed(2),
            change: pctChange(curB.rewritesPerOutput, prevB.rewritesPerOutput),
            period: periodLabel,
          },
          {
            id: "behaviour-accept-rate",
            title: "Accept Rate",
            value: `${curB.acceptRate.toFixed(0)}%`,
            change: pctChange(curB.acceptRate, prevB.acceptRate),
            period: periodLabel,
          },
          {
            id: "behaviour-edit-rate",
            title: "Edit Rate",
            value: `${curB.editRate.toFixed(0)}%`,
            change: pctChange(curB.editRate, prevB.editRate),
            period: periodLabel,
          },
        ],

        rewritesVsAccepts: behaviourData.rewritesVsAccepts,

        // =========================
        // CHARTS (FIXED)
        // =========================
        decksPerUser: {
          title: "Outputs per User",
          months: chartSeries.monthLabels,
          yLabels: chartSeries.decksYLabels,
          min: chartSeries.decksYMin,
          max: chartSeries.decksYMax,
          data: chartSeries.outputsPerUser,
        },

        timeToFirstOutput: {
          title: "Time to First Output",
          xLabels: ["0h", "6h", "1d", "3d", "5d", "10d", "14d"],
          yLabels: ["100%", "80%", "60%", "40%", "20%", "0%"],
          max: 100,
          data: chartSeries.timeToFirstCdf,
        },

        sessionFrequency: {
          title: "Session Frequency (avg / user / month)",
          months: chartSeries.monthLabels,
          yLabels: chartSeries.sessFreqYLabels,
          min: chartSeries.sessFreqYMin,
          max: chartSeries.sessFreqYMax,
          data: chartSeries.sessionFreqPerUser,
        },

        sessionDuration: {
          title: "Avg Session Duration (mins)",
          months: chartSeries.monthLabels,
          yLabels: chartSeries.sessDurYLabels,
          min: chartSeries.sessDurYMin,
          max: chartSeries.sessDurYMax,
          data: chartSeries.sessionDurationMins,
        },

        // =========================
        // STATIC STRUCTURED BLOCKS
        // =========================
        slideTypes: {
          title: "Slide Types",
          slices: [
            {
              label: "Title + Content",
              value: 0,
              color: "#334155",
              textColor: "white",
            },
            {
              label: "Comparison",
              value: 0,
              color: "#1e293b",
              textColor: "white",
            },
            { label: "Chart", value: 0, color: "#e2e8f0", textColor: "#09090b" },
            {
              label: "Quote",
              value: 0,
              color: "#475569",
              textColor: "white",
            },
            {
              label: "Others",
              value: 0,
              color: "#94a3b8",
              textColor: "white",
            },
          ],
        },

        exportTypes: engagementExtras.exportTypes,

        aiStyleSettingsUsage: engagementExtras.aiStyleSettingsUsage,

        slideTimeHeatmap: engagementExtras.slideTimeHeatmap,

        // =========================
        // TOOL USAGE (IMPORTANT)
        // =========================
        toolUsers: {
          tools: ALL_TOOLS.map((tool) => ({
            name: tool,
            users: (toolUsageMap[tool] || 0).toLocaleString(),
          })),
        },

        // =========================
        // JOURNEYS (STRUCTURED ZERO)
        // =========================
        mostCommonJourneys: {
          title: "Most Common Tool Journeys",
          rows: [],
        },

        transitionDropoffsFunnel: {
          title: "Tool Transition Drop-offs",
          stages: [
            "Started",
            "Step 1",
            "Step 2",
            "Step 3",
            "Export",
            "Completed",
          ],
          xLabels: [0, 1, 2, 3, 4, 5],
          min: 0,
          max: 6,
          data: Array(6).fill(0),
        },

        multiToolUsage: {
          title: "Multi-Tool Usage",
          percent: "0%",
          percentLabel: "Users utilize multiple tools",
          rows: [],
          powerUsersLabel: "Power Users:",
          powerUsersValue: "0%",
        },

        toolPairingMatrix: {
          title: "Tool Pairing Effectiveness Matrix",
          rows: [],
        },

        // =========================
        // SLIDE FUNNEL + DECK COMPLETION (presentation jobs + dwell/export analytics)
        // =========================
        slideDropoff: deckFunnelExtras.slideDropoff,

        slideRewritesVsAccepts: deckFunnelExtras.slideRewritesVsAccepts,

        rewritesVsAcceptsFlows: deckFunnelExtras.rewritesVsAcceptsFlows,

        // =========================
        // BOUNCE + COMPLETION
        // =========================
        bouncedDecks: {
          title: "Bounced Decks",
          value: `${deckFunnelExtras.presentationBounce.current.rate.toFixed(0)}%`,
          valueLabel: "bounce rate",
          change: pctChange(
            deckFunnelExtras.presentationBounce.current.rate,
            deckFunnelExtras.presentationBounce.previous.rate,
          ),
          period: periodLabel,
          description: "Total started vs completed decks.",
          breakdown: `(${deckFunnelExtras.presentationBounce.current.started.toLocaleString()} started, ${deckFunnelExtras.presentationBounce.current.exported.toLocaleString()} exported)`,
        },

        completionTime: deckFunnelExtras.completionTime,
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

      const bundle = await SupabaseDB.computeAdminFeatureAdoptionBundle({
        days,
        collabMembers,
        docCollaborators,
      });

      const totalUsers = users.length;

      // =========================
      // JOB COUNT MAP (OPTIMIZED)
      // =========================
      const jobCountMap = new Map<string, number>();

      jobs.forEach((j: any) => {
        jobCountMap.set(j.user_id, (jobCountMap.get(j.user_id) || 0) + 1);
      });

      // =========================
      // ADOPTION FUNNEL (cohort signups in window ∩ jobs in window)
      // =========================
      const discovered = bundle.funnelCurr.discovered;
      const firstUse = bundle.funnelCurr.firstUse;
      const repeat = bundle.funnelCurr.repeat;
      const habitual = bundle.funnelCurr.habitual;

      const percent = (val: number) =>
        discovered > 0 ? ((val / discovered) * 100).toFixed(1) : "0";

      const calcChange = (current: number, previous: number) => {
        if (!previous || previous === 0) return "0%";
        const change = ((current - previous) / previous) * 100;
        const sign = change > 0 ? "+" : "";
        return `${sign}${change.toFixed(1)}%`;
      };

      const getPeriodLabel = (tf: string) => {
        if (tf === "Last 7d") return "vs prev 7d";
        if (tf === "Last 30d") return "vs prev 30d";
        if (tf === "Last 90d") return "vs prev 90d";
        if (tf === "This year") return "vs prior year window";
        return "vs prior window";
      };

      const periodLabel = getPeriodLabel(timeframe);

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
      // FINAL RESPONSE
      // =========================
      const format = (n: number) => n.toLocaleString();

      const top5Projects = collabProjects.slice(0, 5);
      const memberCountsTop5 = top5Projects.map(
        (p: any) => projectMemberMap.get(p.id) || 0,
      );
      const maxMembersTop5 = Math.max(...memberCountsTop5, 1);

      const membersMax = Math.max(bundle.membersAdded.max, 10);
      const membersYLabels = [0, 1, 2, 3, 4, 5].map((i) =>
        String(Math.round((membersMax * (5 - i)) / 5)),
      );

      const commentMax = Math.max(bundle.commentsPerDocument.max, 1);
      const commentYLabels = [0, 1, 2, 3, 4, 5].map((i) =>
        String(Math.round((commentMax * (5 - i)) / 5)),
      );

      const data = {
        header: {
          title: "Feature Adoption",
          subtitle:
            "Measure depth of feature usage — from discovery to habitual use.",
        },

        filters: {
          searchPlaceholder: "Search features, plans, segments...",
          options: {
            Timeframe: [
              "Last 7d",
              "Last 30d",
              "Last 90d",
              "This year",
              "All time",
            ],
            Feature: [
              "All features",
              "Brand Uploads",
              "Collaboration",
              "Export Types",
              "AI Narration",
              "Voice Input",
              "Templates",
              "Chart Builder",
              "Spreadsheet Editor",
            ],
            Plan: ["All plans", "Free", "Pro", "Team", "Enterprise"],
            Role: ["All roles", "Founder", "Operator", "Investor", "Analyst"],
            Region: ["All regions", "N. America", "Europe", "Asia", "Other"],
          },
        },

        // =========================
        // STATS
        // =========================
        stats: [
          {
            id: "discovered",
            title: "Discovered",
            value: format(discovered),
            change: calcChange(
              bundle.funnelCurr.discovered,
              bundle.funnelPrev.discovered,
            ),
            period: periodLabel,
          },
          {
            id: "firstUse",
            title: "First Use",
            value: format(firstUse),
            change: calcChange(
              bundle.funnelCurr.firstUse,
              bundle.funnelPrev.firstUse,
            ),
            period: periodLabel,
          },
          {
            id: "repeatUse",
            title: "Repeat Use",
            value: format(repeat),
            change: calcChange(
              bundle.funnelCurr.repeat,
              bundle.funnelPrev.repeat,
            ),
            period: periodLabel,
          },
          {
            id: "habitual",
            title: "Habitual",
            value: format(habitual),
            change: calcChange(
              bundle.funnelCurr.habitual,
              bundle.funnelPrev.habitual,
            ),
            period: periodLabel,
          },
        ],

        // =========================
        // FUNNEL (REAL)
        // =========================
        adoptionFunnel: {
          title: "Overall Adoption Funnel",
          subheading: "Discovered → First Use → Repeat → Habitual",
          rows: [
            {
              label: "Discovered",
              sublabel: `${format(discovered)} users`,
              percent: 100,
              display: "100%",
            },
            {
              label: "First Use",
              sublabel: `${format(firstUse)} users`,
              percent: +percent(firstUse),
              display: `${percent(firstUse)}%`,
            },
            {
              label: "Repeat Use",
              sublabel: `${format(repeat)} users`,
              percent: +percent(repeat),
              display: `${percent(repeat)}%`,
            },
            {
              label: "Habitual",
              sublabel: `${format(habitual)} users`,
              percent: +percent(habitual),
              display: `${percent(habitual)}%`,
            },
          ],
        },

        // =========================
        // FEATURE GRID (ZERO SAFE)
        // =========================
        featureAdoptionGrid: {
          title: "Funnel per Feature",
          subtitle:
            "Adoption depth for each tracked feature — Discovered → First Use → Repeat Use → Habitual.",
          features: bundle.featureAdoptionGrid.features.map((f) => ({
            id: f.id,
            name: f.name,
            stages: f.stages,
            adoptionScore: f.adoptionScore,
          })),
        },

        // =========================
        // TOP FEATURES
        // =========================
        topFeatures: {
          title: "Feature Adoption Score Matrix",
          subtitle:
            "Adoption depth for all tracked features across all four stages.",
          periods: ["Discovered", "First Use", "Repeat", "Habitual"],
          keys: ["discovered", "firstUse", "repeat", "habitual"],
          rows: bundle.topFeatures.rows,
        },

        // =========================
        // BREAKDOWNS (ZERO SAFE)
        // =========================
        planBreakdown: {
          title: "Breakdown by Plan",
          subtitle: "Share of users reaching each adoption stage by plan.",
          chartWidth: 920,
          chartHeight: 300,
          max: 100,
          yLabels: ["100%", "80%", "60%", "40%", "20%", "0%"],
          stageSeries: [
            { key: "discovered", label: "Discovered", color: "#18181b" },
            { key: "firstUse", label: "First Use", color: "#3f3f46" },
            { key: "repeat", label: "Repeat", color: "#71717a" },
            { key: "habitual", label: "Habitual", color: "#a1a1aa" },
          ],
          plans: bundle.planBreakdown.plans,
        },

        roleBreakdown: {
          title: "Breakdown by Role",
          subtitle: "Adoption stage penetration per user role.",
          chartWidth: 920,
          chartHeight: 300,
          max: 100,
          yLabels: ["100%", "80%", "60%", "40%", "20%", "0%"],
          stageSeries: [
            { key: "discovered", label: "Discovered", color: "#18181b" },
            { key: "firstUse", label: "First Use", color: "#3f3f46" },
            { key: "repeat", label: "Repeat", color: "#71717a" },
            { key: "habitual", label: "Habitual", color: "#a1a1aa" },
          ],
          plans: bundle.roleBreakdown.plans,
        },

        regionBreakdown: {
          title: "Breakdown by Region",
          subtitle: "Adoption stage penetration across regions.",
          chartWidth: 920,
          chartHeight: 300,
          max: 100,
          yLabels: ["100%", "80%", "60%", "40%", "20%", "0%"],
          stageSeries: [
            { key: "discovered", label: "Discovered", color: "#18181b" },
            { key: "firstUse", label: "First Use", color: "#3f3f46" },
            { key: "repeat", label: "Repeat", color: "#71717a" },
            { key: "habitual", label: "Habitual", color: "#a1a1aa" },
          ],
          plans: bundle.regionBreakdown.plans,
        },

        // =========================
        // COLLABORATION (REAL + FIXED)
        // =========================
        workspacesCreated: {
          title: "Workspaces Created",
          total: `${workspacesCreated} total workspaces`,
          rows: top5Projects.map((p: any, i: number) => {
            const n = memberCountsTop5[i] ?? 0;
            return {
              name: p.name,
              users: format(n),
              percent:
                Math.round((n / maxMembersTop5) * 1000) / 10,
            };
          }),
        },

        membersAdded: {
          title: "Members Added",
          months: bundle.membersAdded.months,
          yLabels: membersYLabels,
          max: membersMax,
          bars: bundle.membersAdded.bars,
          trend: bundle.membersAdded.trend,
          timeframeOptions: ["Monthly", "Weekly", "Yearly"],
          selectedTimeframe: "Monthly",
        },

        commentsPerDocument: {
          title: "Comments per Document",
          days: bundle.commentsPerDocument.days,
          yLabels: commentYLabels,
          min: bundle.commentsPerDocument.min,
          max: commentMax,
          data: bundle.commentsPerDocument.data,
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
          rows: topProjects.map((p: any) => ({
            ...p,
            exports: 0,
          })),
        },

        team: {
          title: "Team",
          rows: team.map((t: any) => ({
            ...t,
            exports: 0,
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
      const zero12 = Array(12).fill(0);

      const format = (n: number) => n.toLocaleString();

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
            options: [
              "All segments",
              "Founder",
              "Operator",
              "Investor",
              "Analyst",
            ],
          },
        },

        // =========================
        // CORE METRICS (ZERO SAFE)
        // =========================
        totalRevenue: {
          title: "Total Revenue",
          value: "$0",
          change: "0%",
          period: "vs last month",
        },

        mrr: {
          title: "MRR",
          value: "$0",
          change: "0%",
          period: "vs last month",
        },

        arr: {
          title: "ARR",
          value: "$0",
          change: "0%",
          period: "vs last year",
        },

        freeToPaid: {
          title: "Free → Paid",
          value: `${freeToPaid.toFixed(1)}%`,
          change: "0%",
          period: "vs last month",
        },

        upgradeRate: {
          title: "Upgrade Rate",
          value: "0%",
          change: "0%",
          period: "vs last month",
        },

        downgradeRate: {
          title: "Downgrade Rate",
          value: "0%",
          change: "0%",
          period: "vs last month",
          changeNegativeIsGood: true,
        },

        // =========================
        // REVENUE TREND
        // =========================
        revenueTrend: {
          title: "Revenue Trend",
          subtitle: "MRR and ARR over the last 12 months.",
          months: defaultMonths,
          yLabels: ["60K", "50K", "40K", "30K", "20K", "10K", "0"],
          max: 60,
          min: 0,
          filterOptions: ["MRR", "ARR (÷12)", "Both"],
          selectedFilter: "Both",
          series: [
            { key: "mrr", label: "MRR", color: "#18181b", data: zero12 },
            {
              key: "arr_m",
              label: "ARR (÷12)",
              color: "#a1a1aa",
              data: zero12,
            },
          ],
        },

        // =========================
        // REVENUE BY PLAN
        // =========================
        revenueByPlan: {
          title: "Revenue by Plan",
          subtitle: "Monthly recurring revenue contribution per plan.",
          total: 0,
          rows: [
            {
              plan: "Enterprise",
              revenue: 0,
              formatted: "$0",
              color: "#18181b",
            },
            { plan: "Team", revenue: 0, formatted: "$0", color: "#3f3f46" },
            { plan: "Pro", revenue: 0, formatted: "$0", color: "#71717a" },
            { plan: "Free", revenue: 0, formatted: "$0", color: "#a1a1aa" },
          ],
        },

        // =========================
        // FUNNEL (USAGE BASED)
        // =========================
        conversionFunnel: {
          title: "Free → Paid Conversion Funnel",
          subheading: "User journey",
          rows: [
            {
              label: "Users",
              sublabel: `${format(totalUsers)} users`,
              percent: 100,
              display: "100%",
            },
            {
              label: "Active",
              sublabel: `${format(activeUsers)} users`,
              percent: totalUsers
                ? Math.round((activeUsers / totalUsers) * 100)
                : 0,
              display: `${totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0}%`,
            },
            {
              label: "High Usage",
              sublabel: `${format(paidUsers)} users`,
              percent: freeToPaid,
              display: `${freeToPaid.toFixed(1)}%`,
            },
            {
              label: "Retained",
              sublabel: "0 users",
              percent: 0,
              display: "0%",
            },
          ],
        },

        // =========================
        // EXPORT USAGE
        // =========================
        exportUsageByPlan: {
          title: "Export Usage by Plan",
          subtitle: "Total exports broken down by type and plan.",
          legend: [
            { key: "pdf", label: "PDF", color: "#18181b" },
            { key: "pptx", label: "PPTX", color: "#3f3f46" },
            { key: "docx", label: "DOCX", color: "#71717a" },
            { key: "other", label: "Other", color: "#d4d4d8" },
          ],
          plans: [
            { label: "Free", values: [0, 0, 0, 0] },
            { label: "Pro", values: [0, 0, 0, 0] },
            { label: "Team", values: [0, 0, 0, 0] },
            { label: "Enterprise", values: [0, 0, 0, 0] },
          ],
          max: 0,
          yLabels: ["2000", "1500", "1000", "500", "0"],
        },

        // =========================
        // PAYWALL EVENTS
        // =========================
        paywallEvents: {
          title: "Paywall Interaction Events",
          subtitle: "User interactions with upgrade prompts.",
          events: [
            {
              id: "shown",
              label: "Paywall Shown",
              description: "Users who encountered paywall",
              count: "0",
              rate: null,
              trend: "0%",
              color: "#3f3f46",
            },
            {
              id: "clicked",
              label: "Upgrade Clicked",
              description: "Users clicked upgrade CTA",
              count: "0",
              rate: "0%",
              trend: "0%",
              color: "#18181b",
            },
            {
              id: "completed",
              label: "Payment Completed",
              description: "Users converted",
              count: "0",
              rate: "0%",
              trend: "0%",
              color: "#18181b",
            },
          ],
        },

        // =========================
        // TOP USERS
        // =========================
        topRevenueUsers: {
          title: "Top Users by Revenue",
          subtitle: "Highest-value accounts",
          rows: topUsers.map((u: any) => ({
            ...u,
            plan: "Unknown",
            mrr: "$0",
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

      // Compute event-backed bundle, plus reuse aiFeedback helper (already real).
      const [bundle, aiFeedbackValues] = await Promise.all([
        SupabaseDB.computeAdminAiPerformanceBundle({ days }),
        SupabaseDB.getAiFeedbackOutcomePercents(since, []),
      ]);

      const calcChangePct = (current: number, previous: number) => {
        if (!previous || previous === 0) return "0%";
        const change = ((current - previous) / previous) * 100;
        const sign = change > 0 ? "+" : "";
        return `${sign}${change.toFixed(1)}%`;
      };

      const calcChangeAbs = (
        current: number,
        previous: number,
        unit: string,
      ) => {
        if (!previous && !current) return `0${unit}`;
        const delta = current - previous;
        const sign = delta > 0 ? "+" : "";
        return `${sign}${delta.toFixed(1)}${unit}`;
      };

      const periodLabel = (() => {
        if (timeframe === "Last 7d") return "vs prev 7d";
        if (timeframe === "Last 30d") return "vs prev 30d";
        if (timeframe === "Last 90d") return "vs prev 90d";
        if (timeframe === "This year") return "vs prior year window";
        return "vs prior window";
      })();

      // Latency trend yLabels (chart appends "ms"). Anchor to bundle.max.
      const trendMaxMs = Math.max(bundle.latencyTrend.max, 1000);
      const yStep = trendMaxMs / 5;
      const yLabels = [5, 4, 3, 2, 1, 0].map((i) =>
        String(Math.round(yStep * i)),
      );

      const data = {
        header: {
          title: "AI Performance",
          subtitle:
            "Measure AI output quality, prompt performance, error logs, and latency alerts.",
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
            Persona: ["All personas", "Founder", "Operator", "Investor"],
            Device: ["All devices", "Desktop", "Mobile", "Tablet"],
          },
        },

        // =========================
        // METRICS
        // =========================
        outputMetrics: {
          cards: [
            {
              id: "acceptance",
              icon: "acceptance",
              title: "Output Acceptance Rate",
              value: `${bundle.acceptanceRate.toFixed(1)}%`,
              change: calcChangePct(
                bundle.acceptanceRate,
                bundle.acceptanceRatePrev,
              ),
              period: periodLabel,
            },
            {
              id: "editAccept",
              icon: "editAccept",
              title: "Edit vs Accept Ratio",
              value: "—",
              change: "",
              period: "no edit tracking yet",
            },
            {
              id: "regenerations",
              icon: "regenerations",
              title: "Regen per Output",
              value: `${bundle.regenPerOutput.toFixed(2)}×`,
              change: calcChangeAbs(
                bundle.regenPerOutput,
                bundle.regenPerOutputPrev,
                "×",
              ),
              period: periodLabel,
            },
            {
              id: "latency",
              icon: "latency",
              title: "Avg Time to Generate",
              value: `${bundle.avgLatencyCurrSec.toFixed(1)}s`,
              change: calcChangeAbs(
                bundle.avgLatencyCurrSec,
                bundle.avgLatencyPrevSec,
                "s",
              ),
              period: periodLabel,
            },
          ],
        },

        // =========================
        // SUCCESS (percentages)
        // =========================
        promptSuccess: {
          title: "Prompt Success",
          success: bundle.promptSuccess.successPct,
          failed: bundle.promptSuccess.failedPct,
          legend: [
            { label: "Success", color: "#8696b0" },
            { label: "Failed", color: "#18181b" },
          ],
        },

        // =========================
        // LATENCY TREND (event/job durations bucketed across window)
        // =========================
        latencyTrend: {
          title: "Latency",
          filterOptions: ["Latency"],
          selectedFilter: "Latency",
          months: bundle.latencyTrend.labels,
          yLabels,
          max: trendMaxMs,
          series: [
            {
              label: "Latency",
              color: "#18181b",
              data: bundle.latencyTrend.series,
            },
          ],
        },

        // =========================
        // REGENERATIONS
        // =========================
        regenerations: {
          title: "Regenerations",
          subtitle: `${bundle.regenerations.total.toLocaleString()} total failed generations`,
          rows: bundle.regenerations.rows,
        },

        // =========================
        // FEEDBACK (real via getAiFeedbackOutcomePercents)
        // =========================
        aiFeedback: {
          title: "AI Feedback",
          xLabels: ["Positive", "Neutral", "Negative"],
          yLabels: ["100%", "80%", "60%", "40%", "20%", "0%"],
          max: 100,
          values: aiFeedbackValues,
        },

        // =========================
        // COMPLETION
        // =========================
        completionRate: {
          title: "Prompt Completion Rate",
          filterOptions: [timeframe],
          selectedFilter: timeframe,
          total: bundle.completion.total,
          bars: [
            {
              label: "Completed",
              value: bundle.completion.completedPct,
              color: "#18181b",
            },
            {
              label: "Partial",
              value: bundle.completion.partialPct,
              color: "#8696b0",
            },
            {
              label: "Abandoned",
              value: bundle.completion.abandonedPct,
              color: "#e4e4e7",
            },
          ],
        },

        // =========================
        // LOGS
        // =========================
        aiLogs: {
          title: "AI Logs",
          errors: bundle.logs.errors,
          timeouts: bundle.logs.timeouts,
        },

        // =========================
        // ALERTS
        // =========================
        aiAlerts: {
          title: "Alerts",
          failureSpikes: bundle.alerts.failureSpikes,
          latencyIssues: bundle.alerts.latencyIssues,
        },

        // =========================
        // DRIFT (no model-level baselines yet)
        // =========================
        driftAlerts: {
          title: "Drift Alerts",
          alerts: [],
        },

        // =========================
        // PREDICTIVE (no churn model yet — predictive surfaces stay empty)
        // =========================
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

      const bundle = await SupabaseDB.computeAdminPlatformHealthBundle({ days });

      const calcChangePct = (current: number, previous: number) => {
        if (!previous && !current) return "0%";
        if (!previous) return `+${current.toFixed(2)}%`;
        const delta = current - previous;
        const sign = delta > 0 ? "+" : "";
        return `${sign}${delta.toFixed(2)}%`;
      };

      const periodLabel = (() => {
        if (timeframe === "Last 7d") return "vs prev 7d";
        if (timeframe === "Last 30d") return "vs prev 30d";
        if (timeframe === "Last 90d") return "vs prev 90d";
        if (timeframe === "This year") return "vs prior year window";
        return "vs prior window";
      })();

      const data = {
        header: {
          title: "Platform Health",
          subtitle:
            "Engineering and reliability visibility — API performance, queues, logs, and real-time alerts.",
        },

        filters: {
          searchPlaceholder: "Search incidents, services, alerts...",
          options: {
            Timeframe: [
              "Last 7d",
              "Last 30d",
              "Last 90d",
              "This year",
              "All time",
            ],
          },
        },

        // =========================
        // API PERFORMANCE
        // =========================
        apiPercentiles: {
          title: "API Response Time",
          p50: bundle.apiPercentiles.p50,
          p95: bundle.apiPercentiles.p95,
          p99: bundle.apiPercentiles.p99,
          status: bundle.apiPercentiles.status,
          statusLabel: bundle.apiPercentiles.statusLabel,
          period: `Based on generation-job duration · ${timeframe.toLowerCase()}`,
        },

        errorRate: {
          title: "Error Rate",
          value: `${bundle.errorRate.valuePct.toFixed(2)}%`,
          change: calcChangePct(
            bundle.errorRate.valuePct,
            bundle.errorRate.prevPct,
          ),
          period: periodLabel,
          status: bundle.errorRate.status,
          statusLabel: bundle.errorRate.statusLabel,
        },

        timeoutRate: {
          title: "Timeout Rate",
          value: `${bundle.timeoutRate.valuePct.toFixed(2)}%`,
          change: calcChangePct(
            bundle.timeoutRate.valuePct,
            bundle.timeoutRate.prevPct,
          ),
          period: periodLabel,
          status: bundle.timeoutRate.status,
          statusLabel: bundle.timeoutRate.statusLabel,
        },

        // =========================
        // UPTIME (no infra monitoring yet)
        // =========================
        uptime: {
          title: "Uptime",
          value: (() => {
            const totalSec = Math.max(0, Math.floor(process.uptime()));
            const days = Math.floor(totalSec / 86400);
            const hrs = Math.floor((totalSec % 86400) / 3600);
            const mins = Math.floor((totalSec % 3600) / 60);
            if (days > 0) return `${days}d ${hrs}h`;
            if (hrs > 0) return `${hrs}h ${mins}m`;
            return `${mins}m`;
          })(),
          change: "",
          period: "Process uptime (since last restart)",
          status: "healthy",
          statusLabel: "Healthy",
        },

        // =========================
        // ENDPOINTS (job-type performance proxy)
        // =========================
        endpointPerformance: {
          title: "Endpoint Performance",
          rows: bundle.endpointPerformance.rows,
        },

        // =========================
        // MONITORING
        // =========================
        monitoring: {
          queue: {
            title: "Queue Delays",
            value: bundle.monitoring.queue.value,
            unit: bundle.monitoring.queue.unit,
            status: bundle.monitoring.queue.status,
            statusLabel: bundle.monitoring.queue.statusLabel,
            period: bundle.monitoring.queue.period,
            subRows: bundle.monitoring.queue.subRows,
          },
          exports: {
            title: "Export Processing Time",
            value: bundle.monitoring.exports.value,
            unit: bundle.monitoring.exports.unit,
            status: bundle.monitoring.exports.status,
            statusLabel: bundle.monitoring.exports.statusLabel,
            period: bundle.monitoring.exports.period,
            subRows: bundle.monitoring.exports.subRows,
          },
        },

        // =========================
        // LOGS
        // =========================
        systemLogs: {
          title: "System Logs",
          incidents: bundle.systemLogs.incidents,
          deploys: bundle.systemLogs.deploys,
          releases: bundle.systemLogs.releases,
        },

        // =========================
        // REALTIME ALERTS
        // =========================
        realtimeAlerts: {
          title: "Real-Time System Alerts",
          alerts: bundle.realtimeAlerts.alerts,
        },

        // =========================
        // FAILURE ALERTS
        // =========================
        failuresAlerts: {
          title: "Failures & Alerts",
          subtitle: "Recent generation incidents",
          alerts: bundle.failuresAlerts.alerts,
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
