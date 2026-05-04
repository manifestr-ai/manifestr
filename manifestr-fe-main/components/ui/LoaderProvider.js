import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

const LoaderContext = createContext();

export const useLoader = () => useContext(LoaderContext);

// GLOBAL HANDLER
let globalShowLoader = null;
let globalHideLoader = null;

export const showLoaderGlobal = (msg, duration = null) => {
  if (globalShowLoader) {
    globalShowLoader(msg, duration);
  }
};

export const hideLoaderGlobal = () => {
  if (globalHideLoader) {
    globalHideLoader();
  }
};

export const LoaderProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Loading...");
  const timeoutRef = useRef(null);

  // SHOW LOADER (supports manual + auto)
  const showLoader = useCallback((msg = "Loading...", duration = null) => {
    setMessage(msg);
    setVisible(true);

    // Clear any previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Auto-hide only if duration is provided
    if (duration) {
      timeoutRef.current = setTimeout(() => {
        setVisible(false);
      }, duration);
    }
  }, []);

  // HIDE LOADER (manual)
  const hideLoader = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setVisible(false);
  }, []);

  // Bind global functions
  useEffect(() => {
    globalShowLoader = showLoader;
    globalHideLoader = hideLoader;
  }, [showLoader, hideLoader]);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}

      {visible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Background */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          {/* Loader Card */}
          <div className="relative bg-white rounded-xl px-6 py-5 shadow-lg flex flex-col items-center gap-3 min-w-[250px]">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            <p className="text-sm text-gray-700">{message}</p>
          </div>
        </div>
      )}
    </LoaderContext.Provider>
  );
};