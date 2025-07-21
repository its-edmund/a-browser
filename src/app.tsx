import React, { useState, useEffect } from "react";
import BrowserWebView from "./components/BrowserWebView";
import URLBar from "./components/URLBar";
import Tabs from "./components/Tabs";
import DragLayer from "./components/DragLayer";
import Tab from "./types/Tab";
import { nanoid } from "nanoid";

const App: React.FC = () => {
  const [url, setUrl] = useState("https://example.com");
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: nanoid(),
      url: "https://google.com",
      title: "Google",
    },
    {
      id: nanoid(),
      url: "https://reddit.com",
      title: "Reddit",
    },
  ]);

  const [activeTabId, setActiveTabId] = useState(tabs[0].id);

  /* first render → requestState → hydrate */
  useEffect(() => {
    (async () => {
      const saved = await window.tabsAPI.requestState(); // {tabs, activeId}
      if (saved.tabs.length) {
        setTabs(saved.tabs);
        setActiveTabId(saved.activeId ?? saved.tabs[0].id);
      }
    })();
  }, []);

  const persist = (newTabs: Tab[], newActive: string) => {
    console.log("persisting... " + newTabs);
    window.tabsAPI.saveState({ tabs: newTabs, activeId: newActive });
  };

  const [editingTabId, setEditingTabId] = useState<number | null>(null);
  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  useEffect(() => {
    persist(tabs, activeTabId);
  }, [tabs, activeTabId]);

  return (
    <div className="w-full h-full flex flex-row bg-transparent text-slate-300">
      <div className="w-3xs">
        <Tabs
          tabs={tabs}
          setTabs={setTabs}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
          editingTabId={editingTabId}
          setEditingTabId={setEditingTabId}
        />
      </div>
      <div className="h-full flex flex-col flex-1">
        <BrowserWebView key={activeTab.id} url={activeTab.url} />
      </div>
    </div>
  );
};

export default App;
