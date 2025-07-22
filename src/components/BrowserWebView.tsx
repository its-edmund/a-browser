import React, {
  useEffect,
  useRef,
  forwardRef,
  useState,
  useCallback,
  useImperativeHandle,
} from "react";
import { canonicaliseInput } from "../utils/url";
import { Tab } from "../types/Tab";

export interface BrowserWebviewProps {
  tab: Tab;
  updateTitle?: any;
  onDidFinishLoad?: (url: string) => void;
  hidden: boolean;
}

const BrowserWebview: React.FC<BrowserWebviewProps> = forwardRef(
  ({ tab, updateTitle, onDidFinishLoad, hidden }, externalRef) => {
    const internalRef = useRef<Electron.WebviewTag | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Immediately attach dom-ready handler when <webview> mounts
    const setRef = useCallback((node: Electron.WebviewTag | null) => {
      console.log("📦 webview ref assigned", node);

      if (node) {
        internalRef.current = node;
        console.log("callback run");

        const onDomReady = () => {
          console.log("✅ dom-ready fired");
          // You can perform any post-load setup here
          setIsReady(true);
        };

        node.addEventListener("dom-ready", onDomReady);

        // Optional cleanup
        return () => {
          node.removeEventListener("dom-ready", onDomReady);
        };
      }
    }, []);

    // useEffect(() => {
    //   const view = internalRef.current;
    //   if (!view) return;
    //
    //   const handler = () => onDidFinishLoad?.(view.getURL());
    //   view.addEventListener("did-finish-load", handler);
    //   return () => view.removeEventListener("did-finish-load", handler);
    // }, [onDidFinishLoad]);

    useImperativeHandle(externalRef, () => internalRef.current!, []);

    /* navigate when `url` prop changes */
    useEffect(() => {
      const view = internalRef.current;

      if (view && isReady) {
        const normalizedUrl = canonicaliseInput(tab.url);
        const currentUrl = view.getURL();

        if (normalizedUrl) {
          view.loadURL(normalizedUrl);
        } else {
          view.loadURL(
            `https://www.google.com/search?q=${encodeURIComponent(tab.url)}`,
          );
        }

        console.log(view.canGoBack() + " " + view.canGoForward());

        const title_change_handler = (e) => {
          updateTitle(tab.id, e.title);
        };

        view.addEventListener("page-title-updated", title_change_handler);
        return () =>
          view.removeEventListener("page-title-updated", title_change_handler);
      }
    }, [tab.url, isReady]);

    return (
      <>
        <webview
          ref={setRef}
          src={"about:blank"}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          className={`${hidden && "hidden"} w-full h-full`}
        />
      </>
    );
  },
);

export default BrowserWebview;
