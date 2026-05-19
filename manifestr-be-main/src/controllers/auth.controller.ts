import { Request, Response } from "express";
import { BaseController } from "./base.controller";
import { supabaseAdmin, supabase } from "../lib/supabase";
import SupabaseDB from "../lib/supabase-db";
import { authenticateToken, AuthRequest } from "../middleware/auth.middleware";
import { generateOTP, getExpiryTime, hashOTP } from "../utils/otp";
import { trackEvent, setUserProfile, MixpanelEvents } from "../lib/mixpanel";


interface ApiResponse {
  status: "success" | "error";
  message: string;
  details: any;
}

export class AuthController extends BaseController {
  public basePath = "/auth";

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
      { verb: "POST", path: "/signup", handler: this.signup },
      { verb: "POST", path: "/login", handler: this.login },
      { verb: "POST", path: "/refresh-token", handler: this.refreshToken },
      { verb: "POST", path: "/verify-email", handler: this.verifyEmail },
      {
        verb: "POST",
        path: "/resend-verification",
        handler: this.resendVerification,
      },
      {
        verb: "POST",
        path: "/onboarding",
        handler: this.submitOnboarding,
        middlewares: [authenticateToken],
      },
      {
        verb: "GET",
        path: "/me",
        handler: this.getMe,
        middlewares: [authenticateToken],
      },
      {
        verb: "PATCH",
        path: "/profile",
        handler: this.updateProfile,
        middlewares: [authenticateToken],
      },
      {
        verb: "POST",
        path: "/change-password",
        handler: this.changePassword,
        middlewares: [authenticateToken],
      },
      {
        verb: "GET",
        path: "/sessions",
        handler: this.getSessions,
        middlewares: [authenticateToken],
      },
      {
        verb: "DELETE",
        path: "/sessions/:sessionId",
        handler: this.revokeSession,
        middlewares: [authenticateToken],
      },
      {
        verb: "PATCH",
        path: "/security-alerts",
        handler: this.updateSecurityAlerts,
        middlewares: [authenticateToken],
      },
      {
        verb: "DELETE",
        path: "/account",
        handler: this.deleteAccount,
        middlewares: [authenticateToken],
      },
      { verb: "POST", path: "/google", handler: this.googleLogin },
      //   { verb: "POST", path: "/forgot-password", handler: this.forgotPassword },
      { verb: "POST", path: "/reset-password", handler: this.resetPasswordOTP },
      { verb: "POST", path: "/send-reset-code", handler: this.sendResetCode },
      {
        verb: "POST",
        path: "/verify-reset-code",
        handler: this.verifyResetCode,
      },
    ];
  }

  private sendResponse(
    res: Response,
    statusCode: number,
    status: "success" | "error",
    message: string,
    details: any = null,
  ) {
    const response: ApiResponse = { status, message, details };
    return res.status(statusCode).json(response);
  }

  private signup = async (req: Request, res: Response) => {
    try {
      const {
        email,
        password,
        first_name,
        last_name,
        dob,
        country,
        gender,
        promotional_emails,
      } = req.body;

      if (!email || !password || !first_name || !last_name) {
        return this.sendResponse(res, 400, "error", "Missing required fields");
      }

      // 🔒 STEP 1: Check if subscription exists for this email
      console.log(`🔍 Checking for subscription with email: ${email}`);
      
      const { data: subscription, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .select('id, stripe_customer_id, tier, status, stripe_subscription_id')
        .is('user_id', null) // Only guest subscriptions (not yet linked)
        .eq('status', 'active') // Only active subscriptions
        .order('created_at', { ascending: false })
        .limit(1);

      if (subError) {
        console.error('❌ Error querying subscriptions:', subError);
        return this.sendResponse(
          res,
          500,
          "error",
          "Database error checking email",
          subError.message
        );
      }

      // Check if subscription exists by fetching the Stripe customer email
      let foundSubscription = null;
      if (subscription && subscription.length > 0) {
        // We need to verify the Stripe customer email matches
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        for (const sub of subscription) {
          try {
            const customer = await stripe.customers.retrieve(sub.stripe_customer_id);
            if ('email' in customer && customer.email === email) {
              foundSubscription = sub;
              console.log(`✅ Found subscription ${sub.id} for email ${email}`);
              break;
            }
          } catch (err) {
            console.error('Error retrieving Stripe customer:', err);
          }
        }
      }

      if (!foundSubscription) {
        console.log(`❌ No active subscription found for ${email}`);
        return this.sendResponse(
          res, 
          403, 
          "error", 
          "You must subscribe to a plan before creating an account. Please visit our pricing page."
        );
      }

      console.log(`✅ Subscription verified - proceeding with account creation`);

      // 🔍 FIRST: Check if user already exists in auth.users
      console.log(`🔍 Checking if user already exists in auth.users...`);
      try {
        const { data: existingUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) {
          console.error(`❌ Error listing users:`, JSON.stringify(listError, null, 2));
        } else {
          const existingUser = existingUsers?.users?.find((u: any) => u.email === email);
          if (existingUser) {
            console.log(`⚠️  User already exists in auth.users:`, JSON.stringify(existingUser, null, 2));
            return this.sendResponse(res, 409, "error", "User already exists in auth.users. Please contact support.");
          }
          console.log(`✅ No existing user found in auth.users`);
        }
      } catch (checkError) {
        console.error(`❌ Exception checking existing users:`, checkError);
      }

      // Use admin.createUser with email_confirm: true to skip verification!
      console.log(`📝 Creating Supabase auth user with payload:`, {
        email,
        email_confirm: true,
        user_metadata: { first_name, last_name, dob, country, gender, promotional_emails }
      });
      
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // AUTO-CONFIRM EMAIL - No verification needed!
          user_metadata: {
            first_name,
            last_name,
            dob,
            country,
            gender,
            promotional_emails,
          },
        });

      if (authError) {
        console.error(`❌ Supabase auth error - FULL DETAILS:`);
        console.error(`   - Message: ${authError.message}`);
        console.error(`   - Status: ${authError.status}`);
        console.error(`   - Code: ${(authError as any).code}`);
        console.error(`   - Full error object:`, JSON.stringify(authError, null, 2));
        console.error(`   - Error stack:`, authError.stack);
      } else {
        console.log(`✅ Supabase auth user created: ${authData?.user?.id}`);
      }

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
        if (
          authError.message.includes("already registered") ||
          authError.message.includes("already been registered")
        ) {
          return this.sendResponse(res, 409, "error", "User already exists");
        }
        return this.sendResponse(res, 400, "error", authError.message);
      }

      if (!authData.user) {
        console.error(`❌ No user returned from Supabase auth`);
        return this.sendResponse(res, 400, "error", "Failed to create user");
      }

      // Create user record in our database using Supabase
      console.log(`📝 Creating user record in public.users table...`);
      let user: any;
      try {
        user = await SupabaseDB.createUser({
          id: authData.user.id,
          email,
          first_name,
          last_name,
          dob,
          country,
          gender,
          promotional_emails,
        });
        console.log(`✅ User record created in database`);

        // Update user with tier and Stripe customer ID from subscription
        console.log(`📝 Updating user with tier and Stripe customer ID...`);
        await SupabaseDB.updateUser(authData.user.id, {
          tier: foundSubscription.tier,
          stripe_customer_id: foundSubscription.stripe_customer_id,
        });
        console.log(`✅ User tier updated: ${foundSubscription.tier}`);

        // Update user object for response
        user.tier = foundSubscription.tier;
        user.stripe_customer_id = foundSubscription.stripe_customer_id;

        // 🔗 STEP 2: Link the subscription to the new user
        console.log(`🔗 Linking subscription ${foundSubscription.id} to user ${authData.user.id}`);
        
        const { error: linkError } = await supabaseAdmin
          .from('subscriptions')
          .update({ 
            user_id: authData.user.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', foundSubscription.id);

        if (linkError) {
          console.error(`❌ Failed to link subscription:`, linkError);
          throw new Error(`Failed to link subscription: ${linkError.message}`);
        }
        console.log(`✅ Subscription linked successfully`);

        // 🏆 STEP 3: Grant wins based on tier
        console.log(`🏆 Granting wins for tier: ${foundSubscription.tier}`);
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const { getTierConfig } = require('../lib/stripe');
        const tierConfig = getTierConfig(foundSubscription.tier);
        
        if (tierConfig) {
          console.log(`💰 Granting ${tierConfig.winsPerMonth} wins for ${foundSubscription.tier} tier`);
          
          const { error: winsUpdateError } = await supabaseAdmin
            .from('users')
            .update({
              wins_balance: tierConfig.winsPerMonth,
            })
            .eq('id', authData.user.id);

          if (winsUpdateError) {
            console.error(`❌ Failed to update wins balance:`, winsUpdateError);
            throw new Error(`Failed to update wins: ${winsUpdateError.message}`);
          }

          // Log wins transaction
          const { error: winsTransactionError } = await supabaseAdmin
            .from('wins_transactions')
            .insert({
              user_id: authData.user.id,
              amount: tierConfig.winsPerMonth,
              balance_after: tierConfig.winsPerMonth,
              transaction_type: 'subscription_linked',
              description: `Subscription linked: ${foundSubscription.tier} tier (${tierConfig.winsPerMonth} wins)`,
            });

          if (winsTransactionError) {
            console.error(`❌ Failed to log wins transaction:`, winsTransactionError);
            // Don't throw - this is non-critical
          } else {
            console.log(`✅ Wins granted and logged successfully`);
          }
        } else {
          console.log(`⚠️ No tier config found for ${foundSubscription.tier}`);
        }
      } catch (dbError: any) {
        console.error('❌ Database error during user creation/subscription linking:', dbError);
        console.error('   Error message:', dbError.message);
        console.error('   Error code:', dbError.code);
        if (dbError.details) console.error('   Error details:', dbError.details);
        return this.sendResponse(
          res,
          500,
          "error",
          "Database error during account creation",
          dbError.message
        );
      }

      console.log(` User created and subscription linked successfully`);

      // Track user signup in Mixpanel
      trackEvent(MixpanelEvents.USER_SIGNED_UP, authData.user.id, {
        email,
        first_name,
        last_name,
        country,
        promotional_emails,
        tier: foundSubscription.tier,
        subscription_linked: true,
      });

      // Set user profile in Mixpanel
      setUserProfile(authData.user.id, {
        $email: email,
        $name: `${first_name} ${last_name}`,
        $created: new Date().toISOString(),
        country,
        promotional_emails,
        tier: foundSubscription.tier,
      });

      // Now sign them in to get tokens
      const { data: sessionData, error: sessionError } =
        await supabaseAdmin.auth.signInWithPassword({
          email,
          password,
        });

      if (sessionError || !sessionData.session) {
        // User created but login failed - return success anyway
        return this.sendResponse(
          res,
          201,
          "success",
          "Account created! Please log in.",
          {
            user: this.sanitizeUser(user),
            requiresVerification: false,
          },
        );
      }

      return this.sendResponse(
        res,
        201,
        "success",
        "Account created and logged in successfully!",
        {
          user: this.sanitizeUser(user),
          accessToken: sessionData.session.access_token,
          refreshToken: sessionData.session.refresh_token,
          requiresVerification: false,
        },
      );
    } catch (error) {
      console.error('Signup error:', error);
      return this.sendResponse(
        res,
        500,
        "error",
        "Internal server error",
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  private login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return this.sendResponse(
          res,
          400,
          "error",
          "Email and password are required",
        );
      }

      // Authenticate with Supabase
      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return this.sendResponse(res, 401, "error", "Invalid credentials");
      }

      // Check if email is verified
      if (!data.user.email_confirmed_at) {
        return this.sendResponse(
          res,
          401,
          "error",
          "Please verify your email before logging in",
        );
      }

      // Fetch user from our database using Supabase
      let user = await SupabaseDB.getUserById(data.user.id);

      // If user doesn't exist in our DB, create it
      if (!user) {
        user = await SupabaseDB.createUser({
          id: data.user.id,
          email: data.user.email!,
          first_name: data.user.user_metadata?.first_name || "User",
          last_name: data.user.user_metadata?.last_name || "",
        });
      } else {
        // Update email verification status
        user = await SupabaseDB.updateUser(data.user.id, {
          email_verified: true,
        });
      }

      // Track user login in Mixpanel
      trackEvent(MixpanelEvents.USER_LOGGED_IN, data.user.id, {
        email: data.user.email,
        login_method: 'email_password',
      });

      // Log admin login
      if (user.is_admin) {
        console.log(`👑 ADMIN LOGIN: ${user.email} (ID: ${user.id})`);
      }

      return this.sendResponse(res, 200, "success", "Login successful", {
        user: this.sanitizeUser(user),
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        isAdmin: user.is_admin || false, // Explicitly include admin flag
      });
    } catch (error) {
      return this.sendResponse(
        res,
        500,
        "error",
        "Internal server error",
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  private refreshToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

      if (!refreshToken) {
        return this.sendResponse(
          res,
          401,
          "error",
          "No refresh token provided",
        );
      }

      // Refresh the session with Supabase
      const { data, error } = await supabaseAdmin.auth.refreshSession({
        refresh_token: refreshToken,
      });

      if (error || !data.session) {
        return this.sendResponse(
          res,
          403,
          "error",
          "Invalid or expired refresh token",
        );
      }

      return this.sendResponse(res, 200, "success", "Token refreshed", {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
      });
    } catch (error) {
      return this.sendResponse(res, 500, "error", "Internal server error");
    }
  };

  private verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token, type } = req.body;

      if (!token) {
        return this.sendResponse(
          res,
          400,
          "error",
          "Verification token is required",
        );
      }

      // Verify the token with Supabase
      const { data, error } = await supabaseAdmin.auth.verifyOtp({
        token_hash: token,
        type: type || "signup",
      });

      if (error || !data.user) {
        return this.sendResponse(
          res,
          400,
          "error",
          "Invalid or expired verification token",
        );
      }

      // Update user in our database using Supabase
      let user = null;
      try {
        user = await SupabaseDB.getUserById(data.user.id);
        if (user) {
          user = await SupabaseDB.updateUser(data.user.id, {
            email_verified: true,
          });
        }
      } catch (err) {
        // User might not exist yet
      }

      return this.sendResponse(
        res,
        200,
        "success",
        "Email verified successfully",
        {
          user: user ? this.sanitizeUser(user) : null,
          accessToken: data.session?.access_token,
          refreshToken: data.session?.refresh_token,
        },
      );
    } catch (error) {
      return this.sendResponse(res, 500, "error", "Internal server error");
    }
  };

  private resendVerification = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return this.sendResponse(res, 400, "error", "Email is required");
      }

      // Use resend to trigger email automatically
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email`,
        },
      });

      if (error) {
        // Don't reveal if user exists or not for security
        return this.sendResponse(
          res,
          200,
          "success",
          "If an account exists with this email, a verification email has been sent",
        );
      }

      return this.sendResponse(
        res,
        200,
        "success",
        "Verification email sent successfully",
      );
    } catch (error) {
      return this.sendResponse(res, 500, "error", "Internal server error");
    }
  };

  private submitOnboarding = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;

      const { expertise, job_title, industry, goal, work_style, problems } =
        req.body;

      if (
        !expertise ||
        !job_title ||
        !industry ||
        !goal ||
        !work_style ||
        !problems
      ) {
        return this.sendResponse(res, 400, "error", "Missing required fields");
      }

      // Update user using Supabase
      let user = await SupabaseDB.getUserById(userId);

      if (!user) return this.sendResponse(res, 404, "error", "User not found");

      user = await SupabaseDB.updateUser(userId, {
        expertise,
        job_title,
        industry,
        goal,
        work_style,
        problems,
        onboarding_completed: true,
      });

      return this.sendResponse(res, 200, "success", "Onboarding completed", {
        user: this.sanitizeUser(user),
      });
    } catch (error) {
      return this.sendResponse(
        res,
        500,
        "error",
        "Internal server error",
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  private getMe = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;

      // Get user using Supabase
      const user = await SupabaseDB.getUserById(userId);

      if (!user) return this.sendResponse(res, 404, "error", "User not found");

      return this.sendResponse(res, 200, "success", "User profile retrieved", {
        user: this.sanitizeUser(user),
      });
    } catch (error) {
      return this.sendResponse(
        res,
        401,
        "error",
        "Unauthorized or invalid token",
      );
    }
  };

  private updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;

      // Get current user
      const user = await SupabaseDB.getUserById(userId);
      if (!user) return this.sendResponse(res, 404, "error", "User not found");

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
        profile_image_url,
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
      if (years_of_experience !== undefined)
        updates.years_of_experience = years_of_experience;
      if (profile_image_url !== undefined)
        updates.profile_image_url = profile_image_url;

      // Update user using Supabase - handle column not found errors gracefully
      try {
        const updatedUser = await SupabaseDB.updateUser(userId, updates);
        return this.sendResponse(
          res,
          200,
          "success",
          "Profile updated successfully",
          { user: this.sanitizeUser(updatedUser) },
        );
      } catch (dbError: any) {
        // If column doesn't exist, try again with only basic fields
        if (dbError.message && dbError.message.includes("column")) {
          const basicUpdates: any = {};
          if (first_name !== undefined) basicUpdates.first_name = first_name;
          if (last_name !== undefined) basicUpdates.last_name = last_name;
          if (dob !== undefined) basicUpdates.dob = dob;
          if (gender !== undefined) basicUpdates.gender = gender;
          if (country !== undefined) basicUpdates.country = country;
          if (job_title !== undefined) basicUpdates.job_title = job_title;
          if (industry !== undefined) basicUpdates.industry = industry;

          const updatedUser = await SupabaseDB.updateUser(userId, basicUpdates);
          return this.sendResponse(
            res,
            200,
            "success",
            "Profile updated successfully (some fields skipped)",
            { user: this.sanitizeUser(updatedUser) },
          );
        }
        throw dbError;
      }
    } catch (error) {
      console.error("Update profile error:", error);
      return this.sendResponse(
        res,
        500,
        "error",
        "Internal server error",
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  private changePassword = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return this.sendResponse(
          res,
          400,
          "error",
          "Current password and new password are required",
        );
      }

      if (newPassword.length < 8) {
        return this.sendResponse(
          res,
          400,
          "error",
          "New password must be at least 8 characters long",
        );
      }

      // Get user to verify current password
      const user = await SupabaseDB.getUserById(userId);
      if (!user) return this.sendResponse(res, 404, "error", "User not found");

      // Verify current password by attempting to sign in
      const { error: signInError } =
        await supabaseAdmin.auth.signInWithPassword({
          email: user.email,
          password: currentPassword,
        });

      if (signInError) {
        return this.sendResponse(
          res,
          401,
          "error",
          "Current password is incorrect",
        );
      }

      // Update password using admin API
      const { error: updateError } =
        await supabaseAdmin.auth.admin.updateUserById(userId, {
          password: newPassword,
        });

      if (updateError) {
        return this.sendResponse(
          res,
          500,
          "error",
          "Failed to update password",
        );
      }

      return this.sendResponse(
        res,
        200,
        "success",
        "Password updated successfully",
      );
    } catch (error) {
      console.error("Change password error:", error);
      return this.sendResponse(
        res,
        500,
        "error",
        "Internal server error",
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  private getSessions = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;

      // Get current session info from request
      const userAgent = req.headers["user-agent"] || "Unknown Device";
      const ip = (
        req.ip ||
        req.headers["x-forwarded-for"] ||
        "Unknown"
      ).toString();

      // Return current session (Supabase doesn't easily expose all sessions via API)
      // For full session management, you'd need to implement a custom sessions table
      const sessions = [
        {
          id: "current-session",
          device: this.parseUserAgent(userAgent),
          ip: ip,
          location: "Unknown", // Would need IP geolocation service
          lastActive: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];

      return this.sendResponse(
        res,
        200,
        "success",
        "Sessions retrieved successfully",
        { sessions },
      );
    } catch (error) {
      console.error("Get sessions error:", error);
      return this.sendResponse(
        res,
        500,
        "error",
        "Internal server error",
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  private parseUserAgent(userAgent: string): string {
    // Simple user agent parsing
    if (userAgent.includes("Macintosh")) return "MacBook";
    if (userAgent.includes("Windows")) return "Windows PC";
    if (userAgent.includes("iPhone")) return "iPhone";
    if (userAgent.includes("iPad")) return "iPad";
    if (userAgent.includes("Android")) return "Android Device";
    if (userAgent.includes("Chrome")) return "Chrome Browser";
    if (userAgent.includes("Safari")) return "Safari Browser";
    if (userAgent.includes("Firefox")) return "Firefox Browser";
    return "Unknown Device";
  }

  private revokeSession = async (req: AuthRequest, res: Response) => {
    try {
      const { sessionId } = req.params;
      const userId = req.user!.userId;

      if (!sessionId) {
        return this.sendResponse(res, 400, "error", "Session ID is required");
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
      if (sessionId === "current-session") {
        // Could implement: update user's auth metadata to invalidate all tokens
        console.log(`Session revocation requested for user ${userId}`);
      }

      return this.sendResponse(
        res,
        200,
        "success",
        "Session revoked successfully",
      );
    } catch (error) {
      console.error("Revoke session error:", error);
      return this.sendResponse(
        res,
        500,
        "error",
        "Internal server error",
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  private updateSecurityAlerts = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;
      const {
        loginAlerts,
        passwordChanges,
        suspiciousActivity,
        newDeviceLogin,
      } = req.body;

      // Store security alerts preferences in user metadata or separate table
      const updates: any = {};

      if (loginAlerts !== undefined) updates.alert_login = loginAlerts;
      if (passwordChanges !== undefined)
        updates.alert_password_changes = passwordChanges;
      if (suspiciousActivity !== undefined)
        updates.alert_suspicious_activity = suspiciousActivity;
      if (newDeviceLogin !== undefined)
        updates.alert_new_device = newDeviceLogin;

      // Update user preferences
      const updatedUser = await SupabaseDB.updateUser(userId, updates);

      return this.sendResponse(
        res,
        200,
        "success",
        "Security alerts updated successfully",
        {
          user: this.sanitizeUser(updatedUser),
        },
      );
    } catch (error) {
      console.error("Update security alerts error:", error);
      return this.sendResponse(
        res,
        500,
        "error",
        "Internal server error",
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  private deleteAccount = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.userId;

      // Delete user from Supabase Auth (this will cascade to related data via DB policies)
      const { error: authDeleteError } =
        await supabaseAdmin.auth.admin.deleteUser(userId);

      if (authDeleteError) {
        return this.sendResponse(res, 500, "error", "Failed to delete account");
      }

      // Delete user data from database
      await SupabaseDB.deleteUser(userId);

      return this.sendResponse(
        res,
        200,
        "success",
        "Account deleted successfully",
      );
    } catch (error) {
      console.error("Delete account error:", error);
      return this.sendResponse(
        res,
        500,
        "error",
        "Internal server error",
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  private sanitizeUser(user: any) {
    // Remove sensitive fields
    const { password_hash, ...safeUser } = user;
    return safeUser;
  }

  // Google login endpoint handles OAuth callback with Google token from frontend.

  private googleLogin = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token) {
        return this.sendResponse(res, 400, "error", "Token is required");
      }

      // 1. Verify user with Supabase
      const { data, error } = await supabaseAdmin.auth.getUser(token);

      if (error || !data?.user) {
        return this.sendResponse(res, 401, "error", "Invalid Google token");
      }

      const supabaseUser = data.user;

      const email = supabaseUser.email!;
      const first_name =
        supabaseUser.user_metadata?.full_name?.split(" ")[0] || "User";
      const last_name =
        supabaseUser.user_metadata?.full_name?.split(" ")[1] || "";

      // 2. Check if user exists in your DB
      let user = await SupabaseDB.getUserById(supabaseUser.id);

      // 3. If not → create user (IMPORTANT)
      if (!user) {
        user = await SupabaseDB.createUser({
          id: supabaseUser.id,
          email,
          first_name,
          last_name,
        });
      } else {
        // Ensure verified
        user = await SupabaseDB.updateUser(supabaseUser.id, {
          email_verified: true,
        });
      }

      // 4. Create session (IMPORTANT STEP)
      // Supabase doesn't auto-create session from token → we re-sign in

      const { data: sessionData, error: sessionError } =
        await supabaseAdmin.auth.signInWithIdToken({
          provider: "google",
          token,
        });

      if (sessionError || !sessionData.session) {
        return this.sendResponse(res, 500, "error", "Failed to create session");
      }

      // 5. RETURN SAME STRUCTURE AS LOGIN (CRITICAL)
      return this.sendResponse(res, 200, "success", "Google login successful", {
        user: this.sanitizeUser(user),
        accessToken: sessionData.session.access_token,
        refreshToken: sessionData.session.refresh_token,
      });
    } catch (error) {
      console.error("Google login error:", error);
      return this.sendResponse(res, 500, "error", "Internal server error");
    }
  };

  //   private forgotPassword = async (req: Request, res: Response) => {
  //     try {
  //       const { email } = req.body;

  //       if (!email) {
  //         return this.sendResponse(res, 400, "error", "Email is required");
  //       }

  //       const { error } = await supabase.auth.resetPasswordForEmail(email, {
  //         redirectTo: `${process.env.FRONTEND_URL}/forgot-password`,
  //       });

  //       if (error) {
  //         return this.sendResponse(res, 400, "error", error.message);
  //       }

  //       return this.sendResponse(
  //         res,
  //         200,
  //         "success",
  //         "Password reset email sent",
  //       );
  //     } catch (error) {
  //       return this.sendResponse(res, 500, "error", "Internal server error");
  //     }
  //   };

  private resetPasswordOTP = async (req: Request, res: Response) => {
    try {
      const { email, code, newPassword } = req.body;

      if (!email || !code || !newPassword) {
        return this.sendResponse(res, 400, "error", "Missing fields");
      }

      if (newPassword.length < 8) {
        return this.sendResponse(
          res,
          400,
          "error",
          "Password must be at least 8 characters",
        );
      }

      const hashedCode = hashOTP(code);

      const { data } = await supabaseAdmin
        .from("password_reset_codes")
        .select("*")
        .eq("email", email)
        .eq("code", hashedCode)
        .eq("used", false)
        .eq("verified", true)
        .single();

      if (!data) {
        return this.sendResponse(res, 400, "error", "Invalid code");
      }

      const now = Date.now();
      const expires = new Date(data.expires_at).getTime();

      if (expires < now) {
        return this.sendResponse(res, 400, "error", "Code expired");
      }

      // get user
      const user = await SupabaseDB.getUserByEmail(email);
      if (!user) {
        return this.sendResponse(res, 404, "error", "User not found");
      }

      // update password
      const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password: newPassword,
      });

      if (error) {
        return this.sendResponse(
          res,
          500,
          "error",
          "Failed to update password",
        );
      }

      // mark code as used
      await supabaseAdmin
        .from("password_reset_codes")
        .update({ used: true })
        .eq("id", data.id);

      return this.sendResponse(
        res,
        200,
        "success",
        "Password reset successfully",
      );
    } catch (err) {
      return this.sendResponse(res, 500, "error", "Internal server error");
    }
  };
  private sendResetCode = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return this.sendResponse(res, 400, "error", "Email is required");
      }

      // Check if email exists in Supabase users table
      const { data: user, error: userError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (!user || userError) {
        // For security, don't reveal email existence; continue as if success, but DO NOT send code
        return this.sendResponse(
          res,
          429,
          "error",
          "Failed to send reset code. Please try again or contact support.",
        );
      }

      const { count } = await supabaseAdmin
        .from("password_reset_codes")
        .select("*", { count: "exact", head: true })
        .eq("email", email)
        .gte("created_at", new Date(Date.now() - 60 * 1000).toISOString());

      if (count && count >= 3) {
        return this.sendResponse(
          res,
          429,
          "error",
          "Too many requests. Try later.",
        );
      }

      const code = generateOTP();
      const expiresAt = getExpiryTime();
      const hashedCode = hashOTP(code);

      // OPTIONAL: delete old unused codes
      await supabaseAdmin
        .from("password_reset_codes")
        .delete()
        .eq("email", email);

      // insert new code
      await supabaseAdmin.from("password_reset_codes").insert({
        email,
        code: hashedCode,
        expires_at: expiresAt,
      });

      // TODO: send email (use your email service)
      console.log(`OTP for ${email}: ${code}`);

      // Send the reset code in an email using your preferred email service.
      // You can use nodemailer or another library, but here is an example using nodemailer:

      const nodemailer = require("nodemailer");

      // It's better to use environment variables for credentials in real apps!
    
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.EMAIL_SMTP_PORT) || 587,
        secure: false, // ALWAYS false for 587
        auth: {
          user: process.env.EMAIL_SMTP_USER,
          pass: process.env.EMAIL_SMTP_PASS,
        },
      });
      // Email message details
      const mailOptions = {
        from:
          process.env.EMAIL_FROM_ADDRESS ||
          '"Manifestr" <no-reply@manifestr.xyz>',
        to: email,
        subject: "Your Manifestr Password Reset Code",
        html: `
          <div style="font-family: sans-serif;">
            <h2>Password Reset Request</h2>
            <p>
              Hello,<br /><br />
              You requested a password reset for your Manifestr account.<br /><br />
              <b>Your reset code is:</b>
            </p>
            <p style="font-size:2em; letter-spacing: 0.1em; color: #1976d2;">
              <strong>${code}</strong>
            </p>
            <p>
              This code will expire in 15 minutes.<br /><br />
              If you did not request a password reset, you can safely ignore this email.
            </p>
            <hr/>
            <small>If you have any issues, contact us at support@manifestr.xyz</small>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully");
      } catch (emailErr) {
        console.error("❌ Error sending reset email:", emailErr);
      }

      return this.sendResponse(
        res,
        200,
        "success",
        "If an account exists, a reset code has been sent",
      );
    } catch (err) {

      console.error("Error in sendResetCode:", err);
 
      return this.sendResponse(res, 500, "error", "Internal server error");
    }
  };

  private verifyResetCode = async (req: Request, res: Response) => {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return this.sendResponse(res, 400, "error", "Missing fields");
      }

      const hashedCode = hashOTP(code);

      const { data } = await supabaseAdmin
        .from("password_reset_codes")
        .select("*")
        .eq("email", email)
        .eq("code", hashedCode)
        .eq("used", false)
        .single();

      if (!data) {
        return this.sendResponse(res, 400, "error", "Invalid code");
      }
      const now = Date.now();
      const expires = new Date(data.expires_at).getTime();

      if (expires < now) {
        return this.sendResponse(res, 400, "error", "Code expired");
      }

      await supabaseAdmin
        .from("password_reset_codes")
        .update({ verified: true })
        .eq("id", data.id);

      return this.sendResponse(res, 200, "success", "Code verified");
    } catch (err) {
      return this.sendResponse(res, 500, "error", "Internal server error");
    }
  };
}
