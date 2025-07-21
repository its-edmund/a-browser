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
  const [activeTab, setActiveTab] = useState<Tab | null>(null);

  useEffect(() => {
    console.log("update active tab: " + activeTabId);
    setActiveTab(tabs.find((tab) => tab.id === activeTabId));
  }, [activeTabId]);

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

  const updateTitle = (tabId: number, title: string) => {
    const next = tabs.map((t) => (t.id === tabId ? { ...t, title } : t));
    setTabs(next);
    persist(next, activeTab.id);
  };

  const navigate = (tabId: number, url: string) => {
    const next = tabs.map((t) => (t.id === tabId ? { ...t, url } : t));
    setTabs(next);
    setActiveTabId(tabId);
    persist(next, activeTab.id);
  };

  const createTab = () => {
    const id = nanoid();
    setTabs((t) => [...t, { id, url: "", title: "New Tab" }]); // url = '' means blank
    setActiveTabId(id);
  };

  const deleteTab = (tabId: number) => {
    const next = tabs.filter((t) => t.id !== tabId);
    const nextActive =
      activeTabId === tabId ? (next.length ? next[0].id : "") : activeTabId;
    console.log(nextActive);
    setTabs(next);
    setActiveTabId(nextActive);
    persist(next, nextActive);
  };

  return (
    <div className="w-full h-full flex flex-row text-slate-300">
      <div className="w-3xs">
        <Tabs
          tabs={tabs}
          setTabs={setTabs}
          activeTabId={activeTabId}
          setActiveTabId={setActiveTabId}
          editingTabId={editingTabId}
          setEditingTabId={setEditingTabId}
          navigate={navigate}
          createTab={createTab}
          deleteTab={deleteTab}
        />
      </div>
      <div className="h-full flex flex-col flex-1">
        {tabs.map((tab) => (
          <BrowserWebView
            key={tab.id}
            tab={tab}
            hidden={tab.id !== activeTabId}
            updateTitle={updateTitle}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
