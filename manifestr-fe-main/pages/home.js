import Head from "next/head";
import { useRouter } from "next/router";
import { Plus, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppHeader from "../components/layout/AppHeader";
import BlobCanvas from "../components/onboarding/BlobCanvas";
import Button from "../components/ui/Button";
import ProjectCard from "../components/home/ProjectCard";
import DailyMotivation from "../components/home/DailyMotivation";
import StatsCard from "../components/home/StatsCard";
import LogoFooter from "../components/home/LogoFooter";
import { useOpenAIRealtime } from "../hooks/use-openai-realtime";
import api from "../lib/api";
import { useToast } from "../components/ui/Toast";
import { loaderMsg } from "../utils/loaderMsg";

export default function Home() {
  const router = useRouter();
  const { error: showError } = useToast();
  const [isFocused, setIsFocused] = useState(false);
  // No transcript state needed anymore as per user request
  // State for generation loading screen
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState("");

  const [recentProjects, setRecentProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // If arriving via login, show loader message
  useEffect(() => {
    if (router.query.welcome) {
      loaderMsg("Welcome back! Please wait ...", 2000);
    }
  }, [router.query]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch BOTH owned documents and shared documents
        const [ownedRes, sharedRes] = await Promise.all([
          api.get("/ai/recent-generations"),
          api.get("/collaborations/shared-with-me"),
        ]);

        let allProjects = [];

        // Add owned documents
        if (ownedRes.data.status === "success") {
          allProjects = [...ownedRes.data.data];
        }

        // Add shared documents
        if (sharedRes.data.status === "success") {
          allProjects = [...allProjects, ...sharedRes.data.data];
        }

        // Sort by date (most recent first) and take top 3
        allProjects.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        const projects = allProjects.slice(0, 3);

        setRecentProjects(projects);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  const handleProjectClick = (project) => {
    // AGGRESSIVE type detection - check EVERY possible location
    const type = (
      project.type ||
      project.output_type ||
      project.outputType ||
      project.input_data?.output ||
      project.input_data?.type ||
      project.result?.outputFormat ||
      "document"
    ).toLowerCase();

    console.log("🔍 Opening project:", project.id, "Type:", type);

    // Smart routing based on type
    let path;
    if (type.includes("presentation")) {
      path = `/presentation-editor?id=${project.id}`;
    } else if (type.includes("chart")) {
      // THE analyser shows auto-generated charts
      path = `/chart-editor?id=${project.id}`;
    } else if (type.includes("spreadsheet") || type.includes("sheet")) {
      // Other spreadsheet tools open spreadsheet editor
      path = `/spreadsheet-editor?id=${project.id}`;
    } else if (type.includes("image")) {
      path = `/image-editor?id=${project.id}`;
    } else {
      path = `/docs-editor?id=${project.id}`;
    }

    router.push(path);
  };

  const { connect, disconnect, isConnected, isAiSpeaking, audioAnalyser } =
    useOpenAIRealtime({
      onClose: () => {
        setIsFocused(false);
      },
      onGenerate: async (args) => {
        if (isGenerating) return; // Prevent double trigger
        setIsGenerating(true);
        setGenerationType(args.output || "document");

        // Wait a small moment to let UI update
        await new Promise((r) => setTimeout(r, 100));

        // Stop AI - we are taking over
        disconnect();

        try {
          // Use the authenticated API client
          // This will send the request to NEXT_PUBLIC_API_URL/ai/generate with the Bearer token
          const response = await api.post("/ai/generate", {
            prompt: args.prompt,
            output: args.output,
            meta: args.meta,
          });

          const result = response.data; // Axios puts body in .data

          if (result.status === "success" && result.data.jobId) {
            const finalJobId = result.data.jobId;
            let path = `/docs-editor?id=${finalJobId}`; // Default

            if (args.output?.toLowerCase() === "presentation") {
              path = `/presentation-editor?id=${finalJobId}`;
            } else if (args.output?.toLowerCase() === "spreadsheet") {
              path = `/spreadsheet-editor?id=${finalJobId}`;
            }

            // Add a small delay for "aesthetic" feeling (so user sees the "Creating" screen)
            setTimeout(() => {
              router.push(path);
            }, 1000);
          } else {
            setIsGenerating(false);
            showError("Generation failed to start. Please try again.");
          }
        } catch (error) {
          setIsGenerating(false);
          showError(
            `Error connecting to generation service: ${error.response?.data?.message || error.message}`,
          );
        }
      },
    });

  // Manage Connection based on Focus state
  useEffect(() => {
    let mounted = true;
    if (isFocused) {
      connect();
    } else {
      disconnect();
    }
    return () => {
      mounted = false;
      // Safety disconnect on unmount
      disconnect();
    };
  }, [isFocused]); // Removed connect/disconnect from deps as they are now stable refs inside the hook logic (effectively) or we trust the hook pattern.

  /* Lock body scroll when focused */
  useEffect(() => {
    if (isFocused) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isFocused]);

  // Handle window resize for responsive blob positioning
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // init
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCreateProject = () => {
    router.push("/create-project");
  };

  const handleVaultClick = () => {
    router.push("/vault");
  };
  return (
    <>
      <Head>
        <title>Home - Manifestr</title>
        <meta name="description" content="Manifestr Home" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-white relative min-h-screen w-full overflow-x-hidden">
        {/* Header */}
        <motion.div
          animate={isFocused ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative z-20"
        >
          <AppHeader showRightActions={true} />
        </motion.div>

        {/* Main Content */}
        <main className="pt-[72px] bg-[#f4f4f4] min-h-screen relative flex flex-col items-center">
          <div className="w-full max-w-[1440px] relative flex flex-col items-center md:block md:h-[980px] px-4 md:px-0 py-8 md:py-0">
            {/* Welcome Heading */}
            <motion.div
              animate={
                isFocused ? { y: -50, opacity: 0 } : { y: 0, opacity: 1 }
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative md:absolute md:top-[75px] md:left-1/2 md:transform md:-translate-x-1/2 z-10 w-full text-center mb-6 md:mb-0"
            >
              <h1 className="text-[32px] md:text-[48.531px] font-bold leading-tight md:leading-[46.104px] text-black font-hero whitespace-normal md:whitespace-nowrap">
                {(() => {
                  let user = null;
                  try {
                    user = JSON.parse(localStorage.getItem("user"));
                  } catch {}
                  const name = user
                    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() ||
                      user.email
                    : "User";
                  return <>Welcome Back, {name}</>;
                })()}
              </h1>
            </motion.div>

            {/* Create New Project Button */}
            <motion.div
              animate={
                isFocused
                  ? { scale: 0.8, opacity: 0 }
                  : { scale: 1, opacity: 1 }
              }
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="relative md:absolute md:top-[149px] md:left-1/2 md:transform md:-translate-x-1/2 z-10 mb-8 md:mb-0"
            >
              <Button
                variant="primary"
                className="h-[51px] px-6 rounded-lg w-full md:w-auto"
                onClick={handleCreateProject}
              >
                <Plus className="w-4 h-4 mr-3" />
                <span className="text-[18px] font-medium leading-[28px]">
                  Create New Project
                </span>
              </Button>
            </motion.div>

            {/* Blob Canvas - Interactive */}
            <AnimatePresence mode="wait">
              {!isGenerating && (
                <motion.div
                  key="blob-canvas"
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.5 },
                  }}
                  className="z-0 cursor-pointer mb-8 md:mb-0"
                  onClick={() => !isFocused && setIsFocused(true)}
                  style={{
                    position: isFocused
                      ? "fixed"
                      : isMobile
                        ? "relative"
                        : "absolute",
                    // On mobile (relative), we rely on flow. On desktop (absolute), we map coordinates.
                    top: isFocused ? "42%" : isMobile ? "auto" : 233,
                    left: isFocused ? "50%" : isMobile ? "auto" : "50%",
                    marginLeft: isFocused ? -234 : isMobile ? 0 : -234,
                    marginTop: isFocused ? -233 : 0,
                    zIndex: isFocused ? 50 : 0,
                    scale: isFocused ? 1.4 : 1,
                    width: isMobile ? "100%" : "auto",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div className="relative pointer-events-auto transform scale-75 md:scale-100 origin-center">
                    <BlobCanvas
                      fullscreen={false}
                      blobRadius={4.0}
                      width={468}
                      height={466}
                      isAiSpeaking={isAiSpeaking}
                      disableHover={isConnected}
                      audioAnalyser={audioAnalyser}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading State Text */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  key="generating-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-center w-full px-4"
                >
                  <h2 className="text-[28px] md:text-[40px] font-bold text-[#090909] font-hero tracking-tight">
                    Creating {generationType || "Document"}...
                  </h2>
                  <p className="text-[#666] mt-4 text-base md:text-lg">
                    Just a moment while we get things ready.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close Button (Top Right) */}
            <AnimatePresence mode="wait">
              {isFocused && (
                <>
                  <motion.div
                    key="close-button"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-8 right-8 z-50"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsFocused(false);
                      }}
                      className="w-12 h-12 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center transition-all duration-300 backdrop-blur-md text-black"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Mobile Column Wrapper for Cards */}
            <div className="flex flex-col md:block w-full gap-8">
              {/* Left Section: Recent Projects */}
              <motion.div
                animate={
                  isFocused ? { x: -300, opacity: 0 } : { x: 0, opacity: 1 }
                }
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative md:absolute md:top-[283px] md:left-[8.33%] w-full md:w-[368px] order-2 md:order-none"
              >
                <h2 className="text-[24px] font-semibold leading-[28px] text-[#090909] mb-4">
                  Recent Projects
                </h2>

                {/* Project Cards */}
                <div className="space-y-4">
                  {isLoadingProjects ? (
                    <p className="text-gray-500">Loading...</p>
                  ) : recentProjects.length > 0 ? (
                    recentProjects.map((project, idx) => (
                      <div key={project.id} className="relative">
                        <ProjectCard
                          title={project.title || "Untitled Project"}
                          date={new Date(project.createdAt).toLocaleDateString(
                            "en-GB",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                          status={
                            project.status?.toUpperCase() === "COMPLETED"
                              ? "Generated"
                              : "Processing"
                          }
                          imageSrc={
                            project.coverImage || "/assets/dummy/project-1.png"
                          }
                          index={idx}
                          onClick={() => handleProjectClick(project)}
                        />
                        {/* Shared indicator badge */}
                        {project.isShared && (
                          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                            Shared with you
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No recent projects.</p>
                  )}
                </div>

                {/* Check Out The Vault Button */}
                <Button
                  variant="primary"
                  className="w-full h-[51px] mt-6 rounded-xl border-2 border-[#e4e4e7]"
                  onClick={handleVaultClick}
                >
                  <span className="text-[18px] font-medium leading-[28px]">
                    Check Out The Vault
                  </span>
                </Button>
              </motion.div>

              {/* Right Section: Daily Motivation & Stats */}
              <motion.div
                animate={
                  isFocused ? { x: 300, opacity: 0 } : { x: 0, opacity: 1 }
                }
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative md:absolute md:top-[226px] md:right-[8.33%] w-full md:w-[372px] order-1 md:order-none space-y-8 md:space-y-0"
              >
                {/* Daily Motivation Card */}
                <div className="mb-0 md:mb-8">
                  <DailyMotivation />
                </div>

                {/* Your Stats Card */}
                <StatsCard />
              </motion.div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <motion.div
          animate={isFocused ? { y: 100, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <LogoFooter backgroundColor="#f4f4f4" />
        </motion.div>
      </div>
    </>
  );
}
