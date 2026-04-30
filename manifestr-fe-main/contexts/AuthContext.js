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

  useEffect(() => {
    // Initialize auth state from local storage on mount
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("accessToken");
        const rememberMe = localStorage.getItem("rememberMe") === "1";

        if (!rememberMe) {
          localStorage.removeItem("accessToken");
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
            setUser(null);
          }
        }
      } catch (error) {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Periodic check every 5 minutes
    const intervalId = setInterval(
      async () => {
        if (localStorage.getItem("accessToken") && !isRedirectingRef.current) {
          const result = await refreshProfile();
          if (result) {
          } else {
            // Session expired - logout silently without error popup

            if (!isRedirectingRef.current) {
              localStorage.removeItem("accessToken");
              localStorage.removeItem("user");
              setUser(null);
            }
          }
        }
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(intervalId);
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

      const { user, accessToken } = details;
      // const { user, accessToken } = response.data.details

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("rememberMe", rememberMe ? "1" : "0");
      setUser(user);

      // Redirect to home or previous page
      // Redirect to home or previous page
      if (user?.is_admin) {
        router.push("/admin/overview");
      } else {
        router.push({
          pathname: "/home",
          query: { welcome: "1" },
        });
      }
      // First show loader, then navigate

    
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const verifyEmail = async (token, type = "signup") => {
    try {
      const response = await api.post("/auth/verify-email", { token, type });
      const { user, accessToken } = response.data.details;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
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
