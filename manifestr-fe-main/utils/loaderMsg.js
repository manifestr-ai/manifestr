import {
  showLoaderGlobal,
  hideLoaderGlobal,
} from "../components/ui/LoaderProvider";

// Auto loader (existing behavior)
export const loaderMsg = (message = "Loading...", duration = 1500) => {
  showLoaderGlobal(message, duration);

  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

// Manual control
export const showLoader = (message = "Loading...") => {
  showLoaderGlobal(message);
};

export const hideLoader = () => {
  hideLoaderGlobal();
};