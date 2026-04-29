// utils/loaderMsg.js

import { showLoaderGlobal } from "../components/ui/LoaderProvider";


export const loaderMsg = (message = "Loading...", duration = 1500) => {
  showLoaderGlobal(message, duration);

  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};