import Head from "next/head";
import { useRouter } from "next/router";
import "../components/tiptap-node/image-upload-node/image-upload-node.scss";
import "../components/tiptap-node/blockquote-node/blockquote-node.scss";
import "../components/tiptap-node/code-block-node/code-block-node.scss";
import "../components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "../components/tiptap-node/list-node/list-node.scss";
import "../components/tiptap-node/image-node/image-node.scss";
import "../components/tiptap-node/heading-node/heading-node.scss";
import "../components/tiptap-node/paragraph-node/paragraph-node.scss";
import "../components/tiptap-templates/simple/simple-editor.scss";
import "../components/tiptap-ui/color-highlight-button/color-highlight-button.scss";
import "../components/tiptap-ui-primitive/button/button-colors.scss";
import "../components/tiptap-ui-primitive/button/button-group.scss";
import "../components/tiptap-ui-primitive/button/button.scss";
import "../components/tiptap-ui-primitive/card/card.scss";
import "../components/tiptap-ui-primitive/input/input.scss";
import "../components/tiptap-ui-primitive/popover/popover.scss";
import "../components/tiptap-ui-primitive/toolbar/toolbar.scss";
import "../components/tiptap-ui-primitive/dropdown-menu/dropdown-menu.scss";
import "../components/tiptap-ui-primitive/tooltip/tooltip.scss";
import "../components/tiptap-ui-primitive/separator/separator.scss";
import "../components/tiptap-ui-primitive/badge/badge-colors.scss";
import "../components/tiptap-ui-primitive/badge/badge-group.scss";
import "../components/tiptap-ui-primitive/badge/badge.scss";
import { SidebarProvider } from "../contexts/SidebarContext";
import { AuthProvider } from "../contexts/AuthContext";
import AuthGuard from "../components/auth/AuthGuard";
import { ToastProvider } from "../components/ui/Toast";
import "../styles/global.css";
import { useEffect } from "react";
import { LoaderProvider } from "../components/ui/LoaderProvider";

const POLOTNO_EDITOR_PAGES = ["/presentation-editor", "/image-editor"];

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const isPolotnoPage = POLOTNO_EDITOR_PAGES.some((path) =>
    router.pathname.startsWith(path),
  );

  useEffect(() => {
    if (isPolotnoPage) {
      import("@blueprintjs/core/lib/css/blueprint.css");
    }
  }, [isPolotnoPage]);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Castoro+Titling&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=MonteCarlo&display=swap"
          rel="stylesheet"
        />
        {isPolotnoPage && (
          <>
            <link href="/css-libs/blueprint.css" rel="stylesheet" />
            <link href="/css-libs/blueprint-icons.css" rel="stylesheet" />
            <link href="/css-libs/blueprint.polotno.css" rel="stylesheet" />
          </>
        )}
      </Head>

      <AuthProvider>
        <AuthGuard>
          <SidebarProvider>
            <ToastProvider>
              <LoaderProvider>
                {Component.getLayout ? (
                  Component.getLayout(<Component {...pageProps} />)
                ) : (
                  <Component {...pageProps} />
                )}
              </LoaderProvider>
            </ToastProvider>
          </SidebarProvider>
        </AuthGuard>
      </AuthProvider>
    </>
  );
}
