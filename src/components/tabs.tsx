import React, { useEffect, useState, useRef } from "react";
import { useHotkey } from "../hooks/useHotkey";
import { nanoid } from "nanoid";
import { Plus } from "lucide-react";

const TabView = ({
  tab,
  setTabs,
  activeTabId,
  setActiveTabId,
  editingTabId,
  setEditingTabId,
}) => {
  const [active, setActive] = useState(activeTabId === tab.id);
  const [url, setUrl] = useState(tab.url);
  const wrapperRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (activeTabId !== tab.id) {
      setEditingTabId(null);
      setActive(false);
    } else {
      setActive(true);
    }
  }, [activeTabId]);

  const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    const next = e.relatedTarget as Node | null; // who gets focus next
    if (!wrapperRef.current?.contains(next)) {
      setEditingTabId(null);
      setUrl(tab.url);
    }
  };

  return (
    <div
      className={`${active && "bg-neutral-200/10"} ${editingTabId === tab.id && "bg-neutral-200/30"} py-1 px-2 w-full rounded-md text-sm`}
      onClick={() => {
        if (active) {
          setEditingTabId(tab.id);
        } else {
          setActiveTabId(tab.id);
        }
      }}
    >
      {editingTabId === tab.id ? (
        <form
          ref={wrapperRef}
          className="flex flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setEditingTabId(null);
            setTabs((oldTabs) =>
              oldTabs.map((oldTab) =>
                tab.id === oldTab.id ? { ...oldTab, url: url } : oldTab,
              ),
            );
          }}
          onBlur={handleBlur}
        >
          <input
            className="outline-none w-full"
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            className="bg-white text-black text-bold rounded-md px-1"
            type="submit"
          >
            Go
          </button>
        </form>
      ) : (
        tab.title
      )}
    </div>
  );
};

const Tabs = ({
  tabs,
  setTabs,
  activeTabId,
  setActiveTabId,
  editingTabId,
  setEditingTabId,
}) => {
  const createTab = () => {
    const id = nanoid();
    setTabs((t) => [...t, { id, url: "", title: "New Tab", editing: true }]); // url = '' means blank
    setActiveTabId(id);
  };

  // Cmd/Ctrl + L focuses the address bar
  useHotkey(
    (e) => (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "t",
    () => console.log("newTab"),
  );

  return (
    <div className="h-full w-3xs">
      <div
        className="h-12 w-full flex flex-row items-center px-4"
        style={{ WebkitAppRegion: "drag" }}
      >
        <div className="ml-auto" style={{ WebkitAppRegion: "no-drag" }}>
          <button
            className="p-1 rounded-md hover:bg-slate-200/10"
            onClick={() => createTab()}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className="flex flex-col m-3">
        {tabs.map((tab) => {
          return (
            <TabView
              tab={tab}
              setTabs={setTabs}
              activeTabId={activeTabId}
              setActiveTabId={setActiveTabId}
              editingTabId={editingTabId}
              setEditingTabId={setEditingTabId}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
