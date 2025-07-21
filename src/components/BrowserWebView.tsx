import React, { useEffect, useRef } from "react";
import { canonicaliseInput } from "../utils/url";

export interface BrowserWebviewProps {
  /** Absolute URL to show */
  url: string;
  /** Called when navigation finishes */
  onDidFinishLoad?: (url: string) => void;
}

const BrowserWebview: React.FC<BrowserWebviewProps> = ({
  url,
  onDidFinishLoad,
}) => {
  const ref = useRef<HTMLWebViewElement>(null);

  /* wire up events once */
  useEffect(() => {
    const view = ref.current;
    if (!view) return;

    const handler = () => onDidFinishLoad?.(view.getURL());
    view.addEventListener("did-finish-load", handler);
    return () => view.removeEventListener("did-finish-load", handler);
  }, [onDidFinishLoad]);

  /* navigate when `url` prop changes */
  useEffect(() => {
    if (ref.current && ref.current.getAttribute("src") !== url) {
      const normalizedUrl = canonicaliseInput(url);
      if (normalizedUrl) {
        ref.current.setAttribute("src", normalizedUrl);
      } else {
        ref.current.setAttribute(
          "src",
          `https://www.google.com/search?q=${encodeURIComponent(url)}`,
        );
      }
    }
  }, [url]);

  return (
    <webview
      ref={ref}
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
      className="w-full h-full"
    />
  );
};

export default BrowserWebview;
