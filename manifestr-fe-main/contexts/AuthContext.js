import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import api from "../lib/api";
import { supabase } from "../lib/supabase";
import { loaderMsg } from "../utils/loaderMsg";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isRedirectingRef = useRef(false); // Prevent redirect loops

  const forceLogout = () => {
    if (isRedirectingRef.current) return; // Already redirecting, skip

    isRedirectingRef.current = true;

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("pendingUser");
    localStorage.removeItem("pendingVerificationEmail");
    setUser(null);

    // Use replace to avoid stacking URLs
    router.replace("/login");

    setTimeout(() => {
      isRedirectingRef.current = false;
    }, 2000);
  };

  const refreshProfile = async () => {
    try {
      const response = await api.get("/auth/me");
      const updatedUser = response.data.details.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      // DON'T THROW - Just log and return null to prevent error popup
      return null;
    }
  };

  // 🔥 PROACTIVE TOKEN REFRESH - Prevents token expiration
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn(" No refresh token available for proactive refresh");
        return false;
      }

      console.log("🔄 Proactively refreshing access token...");

      const response = await api.post("/auth/refresh-token", {
        refreshToken: refreshToken
      });

      const newAccessToken = response?.data?.details?.accessToken;
      const newRefreshToken = response?.data?.details?.refreshToken;

      if (newAccessToken) {
        localStorage.setItem("accessToken", newAccessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }
        console.log(" Token refreshed proactively - user stays logged in!");
        return true;
      }
      return false;
    } catch (error) {
      console.error(" Proactive token refresh failed:", error);
      return false;
    }
  };

  useEffect(() => {
    // Initialize auth state from local storage on mount
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("accessToken");
        const rememberMe = localStorage.getItem("rememberMe") === "1";

        if (!rememberMe) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          setUser(null);
        }

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          // Fetch fresh profile in background to validate
          const result = await refreshProfile();
          if (!result) {
            localStorage.removeItem("user");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setUser(null);
          }
        }
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 🔥 INTERVAL 1: PROACTIVE TOKEN REFRESH - Every 30 minutes (BEFORE 1-hour expiry)
    // This prevents tokens from EVER expiring - tokens get refreshed automatically!
    const tokenRefreshInterval = setInterval(
      async () => {
        if (localStorage.getItem("accessToken") && localStorage.getItem("refreshToken") && !isRedirectingRef.current) {
          console.log("⏰ Time for proactive token refresh (30 min interval)");
          const success = await refreshAccessToken();
          if (!success) {
            console.warn("⚠️ Proactive refresh failed - will retry on next interval or API call");
          }
        }
      },
      30 * 60 * 1000 // 🔥 30 MINUTES - Refresh BEFORE tokens expire (tokens expire after 1 hour)
    );

    // 🔥 INTERVAL 2: Profile check every 5 minutes (verify user still active)
    const profileCheckInterval = setInterval(
      async () => {
        if (localStorage.getItem("accessToken") && !isRedirectingRef.current) {
          const result = await refreshProfile();
          if (!result) {
            // Session expired or user suspended - logout silently
            if (!isRedirectingRef.current) {
              console.warn("⚠️ Profile check failed - user might be suspended or session invalid");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
              setUser(null);
            }
          }
        }
      },
      5 * 60 * 1000 // 5 minutes
    );

    return () => {
      clearInterval(tokenRefreshInterval);
      clearInterval(profileCheckInterval);
    };
  }, []);

  const signup = async (userData) => {
    try {
      const response = await api.post("/auth/signup", userData);
      const { user, requiresVerification, email } = response.data.details;

      if (requiresVerification) {
        // Email verification required - don't log in yet
        localStorage.setItem("pendingVerificationEmail", email);
        return { ...response.data, requiresVerification: true, email };
      }

      // If no verification required (shouldn't happen now)
      const { accessToken, refreshToken } = response.data.details;
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password, rememberMe = true) => {
    try {
      const response = await api.post("/auth/login", { email, password });

      const details = response.data?.details;

      if (!details) {
        throw new Error("Incorrect email or password. Please try again.");
      }

      const { user, accessToken, refreshToken } = details;

      // 🔥 CRITICAL: Store both access token AND refresh token
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
        console.log("✅ Refresh token stored successfully");
      } else {
        console.warn("⚠️ No refresh token received from backend");
      }
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("rememberMe", rememberMe ? "1" : "0");
      setUser(user);

      // Redirect to home or previous page
      if (user?.is_admin) {
        router.push("/admin/overview");
      } else {
        router.push({
          pathname: "/home",
          query: { welcome: "1" },
        });
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (token, type = "signup") => {
    try {
      const response = await api.post("/auth/verify-email", { token, type });
      const { user, accessToken, refreshToken } = response.data.details;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
          console.log("✅ Refresh token stored after email verification");
        }
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.removeItem("pendingUser");
        setUser(user);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const resendVerification = async (email) => {
    try {
      const response = await api.post("/auth/resend-verification", { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    if (isRedirectingRef.current) return;

    try {
      // Optional: Call revoke session endpoint
    } catch (error) {
    } finally {
      isRedirectingRef.current = true;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("pendingUser");
      localStorage.removeItem("pendingVerificationEmail");
      setUser(null);

      // Use replace instead of push to avoid stacking URLs
      router.replace("/login");

      setTimeout(() => {
        isRedirectingRef.current = false;
      }, 1000);
    }
  };

  // google login
  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        forceLogout,
        verifyEmail,
        resendVerification,
        setUser,
        refreshProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
