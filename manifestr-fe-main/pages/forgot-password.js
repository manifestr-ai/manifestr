import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useMemo, useRef, memo, useEffect } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimationFrame,
  AnimatePresence,
} from "framer-motion";
import Logo from "../components/logo/Logo";
import Loader from "../components/ui/Loader";
import Step1 from "../components/forgot-password/Step1";
import Step2 from "../components/forgot-password/Step2";
import Step3 from "../components/forgot-password/Step3";
import Step4 from "../components/forgot-password/Step4";

import api from "../lib/api";

// Marquee Line Component - moved outside to prevent recreation on re-renders
const MarqueeLine = memo(function MarqueeLine({
  lineIndex,
  topPosition,
  shuffledPhrases,
  getFontFamily,
}) {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const baseX = useMotionValue(0);
  const direction = lineIndex % 2 === 0 ? 1 : -1; // 1 for right, -1 for left

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;
    const contentWidth = content.scrollWidth;
    const halfContentWidth = contentWidth / 2;

    // Calculate speed: move half content width in 60 seconds (60000ms) - slower
    // Speed in pixels per millisecond
    const speedPxPerMs = halfContentWidth / 300000;

    let animationId;
    let lastTime = performance.now();
    let isRunning = true;

    const animate = (currentTime) => {
      if (!isRunning) return;

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const currentX = baseX.get();
      const movement = direction * speedPxPerMs * deltaTime;
      let newX = currentX + movement;

      // Reset when we've moved exactly half the content width
      if (direction > 0 && newX >= 0) {
        // Moving right: reset when we reach 0 (back to -halfContentWidth)
        newX = newX - halfContentWidth;
      } else if (direction < 0 && newX <= -halfContentWidth) {
        // Moving left: reset when we reach -halfContentWidth (back to 0)
        newX = newX + halfContentWidth;
      }

      baseX.set(newX);
      animationId = requestAnimationFrame(animate);
    };

    // Set initial position
    baseX.set(direction > 0 ? -halfContentWidth : 0);
    lastTime = performance.now();
    animationId = requestAnimationFrame(animate);

    return () => {
      isRunning = false;
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []); // Empty dependency array - only run once on mount, direction is stable

  const x = useTransform(baseX, (value) => `${value}px`);

  return (
    <div
      ref={containerRef}
      className="absolute left-0 w-full overflow-hidden"
      style={{
        top: `${topPosition}px`,
      }}
    >
      <motion.div
        ref={contentRef}
        className="flex items-baseline text-[140px] md:text-[140px] font-bold text-white whitespace-nowrap"
        style={{ x }}
      >
        {/* First set of phrases */}
        {shuffledPhrases.map((phrase, phraseIndex) => (
          <span
            key={`first-${lineIndex}-${phraseIndex}`}
            className="px-8 inline-block"
            style={{
              lineHeight: "1",
              verticalAlign: "baseline",
            }}
          >
            {phrase.parts.map((part, partIndex) => (
              <span
                key={partIndex}
                style={{
                  fontFamily: getFontFamily(part.font),
                }}
              >
                {part.text}
              </span>
            ))}
          </span>
        ))}
        {/* Duplicate set - this is what creates the seamless loop */}
        {shuffledPhrases.map((phrase, phraseIndex) => (
          <span
            key={`second-${lineIndex}-${phraseIndex}`}
            className="px-8 inline-block"
            style={{
              lineHeight: "1",
              verticalAlign: "baseline",
            }}
          >
            {phrase.parts.map((part, partIndex) => (
              <span
                key={partIndex}
                style={{
                  fontFamily: getFontFamily(part.font),
                }}
              >
                {part.text}
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
});

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");

  const showLoader = (message, nextStep, delay = 2000) => {
    setIsLoading(true);
    setLoadingMessage(message);

    setTimeout(() => {
      setIsLoading(false);
      setStep(nextStep);
    }, delay);
  };

  const handleStep1Next = async (emailValue) => {
    try {
      setEmail(emailValue);
      setIsLoading(true);
      setLoadingMessage("Sending code...");

      await api.post("/auth/send-reset-code", {
        email: emailValue,
      });

      setIsLoading(false);
      setStep(2);
    } catch (err) {
      setIsLoading(false);
      window.alert(
        err?.response?.data?.message
          ? `${err.response.data.message}`
          : "Failed to send reset code. Please try again or contact support."
      );
 
    }
  };

  const handleStep2Next = async (code) => {
    try {
      setIsLoading(true)
      setLoadingMessage('Verifying code...')
  
      await api.post('/auth/verify-reset-code', {
        email,
        code,
      })
  
      setResetCode(code) 
  
      setIsLoading(false)
      setStep(3)
  
    } catch (err) {
      setIsLoading(false)
      window.alert(
        err?.response?.data?.message
          ? `${err.response.data.message}`
          : "Invalid Code!"
      );
    }
  }

  const handleStep3Next = async ({ password }) => {
    try {
      setIsLoading(true)
      setLoadingMessage('Updating password...')
  
      await api.post('/auth/reset-password', {
        email,
        code: resetCode,
        newPassword: password,
      })
  
      setIsLoading(false)
      setStep(4)
  
    } catch (err) {
      setIsLoading(false)
      throw err
    }
  };

  const handleStep4Continue = () => {
    // Redirect to home page
    router.push("/home");
  };

  // Helper function to get font family
  const getFontFamily = (fontClass) => {
    if (fontClass === "font-castoro-titling") return "Castoro Titling, serif";
    if (fontClass === "font-monte-carlo") return "MonteCarlo, cursive";
    return "Hanken Grotesk, sans-serif"; // font-hero or default
  };

  // Background text phrases with font-matched words and punctuation
  const backgroundPhrases = [
    {
      parts: [
        { text: "LUXURIOUS", font: "font-castoro-titling" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "PREMIUM", font: "font-hero" },
        { text: ".", font: "font-hero" },
      ],
    },
    {
      parts: [
        { text: "BOLD", font: "font-hero" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "ELEGANT", font: "font-monte-carlo" },
        { text: ",", font: "font-castoro-titling" },
        { text: " ", font: "font-hero" },
        { text: "POWERFUL", font: "font-hero" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "DYNAMIC", font: "font-hero" },
        { text: ".", font: "font-hero" },
      ],
    },
    {
      parts: [
        { text: "VISIONARY", font: "font-castoro-titling" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "INNOVATIVE", font: "font-monte-carlo" },
        { text: ".", font: "font-hero" },
      ],
    },
    {
      parts: [
        { text: "REFINED", font: "font-castoro-titling" },
        { text: ",", font: "font-castoro-titling" },
        { text: " ", font: "font-hero" },
        { text: "SOPHISTICATED", font: "font-hero" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "EXCEPTIONAL", font: "font-castoro-titling" },
        { text: ".", font: "font-hero" },
      ],
    },
    {
      parts: [
        { text: "EXQUISITE", font: "font-castoro-titling" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "TIMELESS", font: "font-castoro-titling" },
        { text: ",", font: "font-castoro-titling" },
        { text: " ", font: "font-hero" },
        { text: "AUTHENTIC", font: "font-castoro-titling" },
        { text: ".", font: "font-hero" },
      ],
    },
    {
      parts: [
        { text: "CREATIVE", font: "font-monte-carlo" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "INSPIRING", font: "font-monte-carlo" },
        { text: ".", font: "font-hero" },
      ],
    },
    {
      parts: [
        { text: "PRECISE", font: "font-hero" },
        { text: ",", font: "font-castoro-titling" },
        { text: " ", font: "font-hero" },
        { text: "FOCUSED", font: "font-hero" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "STRATEGIC", font: "font-hero" },
        { text: ".", font: "font-hero" },
      ],
    },
    {
      parts: [
        { text: "MASTERFUL", font: "font-castoro-titling" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "DISTINCTIVE", font: "font-hero" },
        { text: ".", font: "font-hero" },
      ],
    },
    {
      parts: [
        { text: "PROFOUND", font: "font-castoro-titling" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "TRANSCENDENT", font: "font-monte-carlo" },
        { text: ".", font: "font-hero" },
      ],
    },
    {
      parts: [
        { text: "REVOLUTIONARY", font: "font-hero" },
        { text: ",", font: "font-castoro-titling" },
        { text: " ", font: "font-hero" },
        { text: "LIMITLESS", font: "font-hero" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "UNPARALLELED", font: "font-castoro-titling" },
        { text: ".", font: "font-hero" },
      ],
    },
    {
      parts: [
        { text: "SUBLIME", font: "font-castoro-titling" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "RADIANT", font: "font-monte-carlo" },
        { text: ".", font: "font-hero" },
      ],
    },
    {
      parts: [
        { text: "MINIMAL", font: "font-hero" },
        { text: ",", font: "font-castoro-titling" },
        { text: " ", font: "font-hero" },
        { text: "CALM", font: "font-monte-carlo" },
        { text: " & ", font: "font-castoro-titling" },
        { text: "SERENE", font: "font-monte-carlo" },
        { text: ".", font: "font-hero" },
      ],
    },
  ];

  // Pre-calculate shuffled phrases for each line (only once)
  const linePhrases = useMemo(() => {
    return [...Array(20)].map((_, lineIndex) => {
      const startOffset = lineIndex % backgroundPhrases.length;
      return [
        ...backgroundPhrases.slice(startOffset),
        ...backgroundPhrases.slice(0, startOffset),
      ];
    });
  }, []);

  return (
    <>
      <Head>
        <title>Forgot Password - Manifestr</title>
        <meta name="description" content="Reset your Manifestr password" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#f4f4f5] relative overflow-hidden">
        {/* Multiple Marquee Lines Filling Screen */}
        <div className="absolute top-[-2%] left-0 w-full h-[200vh] overflow-hidden pointer-events-none opacity-[0.9] z-0">
          {[...Array(8)].map((_, lineIndex) => {
            // Calculate top position with 4px gaps between lines
            // Approximate line height: ~150px for text + 4px gap = ~154px per line
            const lineHeight = 150; // Approximate height of text
            const gap = -10; // Gap between lines
            const totalLineHeight = lineHeight + gap;
            const topPosition = lineIndex * totalLineHeight;

            // Use pre-calculated phrases for this line (stable across renders)
            const shuffledPhrases = linePhrases[lineIndex];

            return (
              <MarqueeLine
                key={lineIndex}
                lineIndex={lineIndex}
                topPosition={topPosition}
                shuffledPhrases={shuffledPhrases}
                getFontFamily={getFontFamily}
              />
            );
          })}
        </div>

        {/* Header Navigation */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1280px] z-20">
          <div className="flex h-[72px] items-center justify-between px-8">
            <Logo size="md" />
            <Link
              href="/help"
              className="text-l2-medium text-base-secondary hover:opacity-80 px-1"
            >
              Help?
            </Link>
          </div>
        </div>

        {/* Centered Card */}
        <div
          className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-full max-w-[480px] 
          bg-white rounded-2xl shadow-[0px_44px_110px_0px_rgba(22,34,51,0.2)]
          p-4 sm:p-6 md:p-8 z-10
   
        "
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-8 items-center w-full"
              >
                <Loader message={loadingMessage} duration={2000} />
              </motion.div>
            ) : (
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="flex flex-col gap-8 items-center w-full"
              >
                {/* Step 1: Email Input */}
                {step === 1 && <Step1 onNext={handleStep1Next} />}

                {/* Step 2: Verification Code */}
                {step === 2 && (
                  <Step2
                    email={email}
                    onNext={handleStep2Next}
                    disabled={isLoading}
                  />
                )}

                {/* Step 3: Create New Password */}
                {step === 3 && <Step3 email={email} onNext={handleStep3Next} />}

                {/* Step 4: Password Reset Success */}
                {step === 4 && <Step4 onContinue={handleStep4Continue} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="absolute bottom-[52px] left-8 z-10">
          <p className="text-l2-regular text-base-muted-foreground">
            © MANIFESTR LLC 2050
          </p>
        </div>
      </div>
    </>
  );
}
