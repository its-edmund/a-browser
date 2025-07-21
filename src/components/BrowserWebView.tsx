import React, { useEffect, useRef } from "react";
import { canonicaliseInput } from "../utils/url";
import { Tab } from "../types/Tab";

export interface BrowserWebviewProps {
  tab: Tab;
  updateTitle?: any;
  onDidFinishLoad?: (url: string) => void;
  hidden: boolean;
}

const BrowserWebview: React.FC<BrowserWebviewProps> = ({
  tab,
  updateTitle,
  onDidFinishLoad,
  hidden,
}) => {
  const ref = useRef<HTMLWebViewElement>(null);

  useEffect(() => {
    console.log(hidden);
  }, [hidden]);

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
    const view = ref.current;
    if (!view) return;

    if (ref.current && ref.current.getAttribute("src") !== tab.url) {
      const normalizedUrl = canonicaliseInput(tab.url);
      if (normalizedUrl) {
        ref.current.setAttribute("src", normalizedUrl);
      } else {
        ref.current.setAttribute(
          "src",
          `https://www.google.com/search?q=${encodeURIComponent(tab.url)}`,
        );
      }
      const title_change_handler = (e) => {
        console.log("load title: " + e.title);
        updateTitle(tab.id, e.title);
      };
      view.addEventListener("page-title-updated", title_change_handler);
      return () =>
        view.removeEventListener("page-title-updated", title_change_handler);
    }
  }, [tab.url]);

  return (
    <>
      {tab.url && (
        <webview
          ref={ref}
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          className={`${hidden && "hidden"} w-full h-full`}
        />
      )}
    </>
  );
};

export default BrowserWebview;
