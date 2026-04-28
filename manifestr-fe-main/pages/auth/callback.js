import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../lib/supabase";
import api from "../../lib/api";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    const handleLogin = async () => {
      try {
        // 1. Get Supabase session
        const { data, error } = await supabase.auth.getSession();

        if (error || !data?.session) {
          router.replace("/login");
          return;
        }

        const token = data.session.access_token;

        // 2. Send to YOUR backend
        const response = await api.post("/auth/google", {
          token,
        });

        const { user, accessToken } = response.data.details;

        // 3. Store like your normal login
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));

        // 4. Redirect
        router.replace("/home");
      } catch (err) {
        console.error(err);
        router.replace("/login");
      }
    };

    handleLogin();
  }, []);

  return <p>Signing you in...</p>;
}