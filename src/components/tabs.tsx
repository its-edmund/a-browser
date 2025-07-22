import React, { useEffect, useState, useRef } from "react";
import { useHotkey } from "../hooks/useHotkey";
import { nanoid } from "nanoid";
import { Plus, X } from "lucide-react";

const TabView = ({
  tab,
  setTabs,
  activeTabId,
  setActiveTabId,
  editingTabId,
  setEditingTabId,
  navigate,
  deleteTab,
}) => {
  const [url, setUrl] = useState(tab.url);
  const wrapperRef = useRef<HTMLFormElement>(null);

  const handleBlur = (e: React.FocusEvent<HTMLFormElement>) => {
    const next = e.relatedTarget as Node | null; // who gets focus next
    if (!wrapperRef.current?.contains(next)) {
      setEditingTabId(null);
      setUrl(tab.url);
    }
  };

  return (
    <div
      className={`${activeTabId === tab.id && "bg-neutral-200/10"} ${editingTabId === tab.id && "bg-neutral-200/30"} py-1 px-2 w-full rounded-md text-sm group flex flex-row items-center`}
      onClick={() => {
        setActiveTabId(tab.id);
      }}
    >
      {editingTabId === tab.id ? (
        <form
          ref={wrapperRef}
          className="flex flex-row flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            navigate(tab.id, url);
            setEditingTabId(null);
          }}
          onBlur={handleBlur}
        >
          <input
            className="outline-none w-full"
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Search or Go..."
          />
          <button
            className="bg-white text-black text-bold rounded-md px-1 ml-1"
            type="submit"
          >
            Go
          </button>
        </form>
      ) : (
        <div
          className="flex-1 text-nowrap overflow-hidden"
          onClick={() => {
            if (activeTabId === tab.id) {
              setEditingTabId(tab.id);
            }
          }}
        >
          {tab.title}
        </div>
      )}
      <div className="opacity-0 transition-opacity group-hover:opacity-100 duration-300 flex flex-row items-center pl-2">
        <button
          className="hover:bg-neutral-300/20 transition-color rounded-sm"
          onClick={() => deleteTab(tab.id)}
        >
          <X size={16} />
        </button>
      </div>
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
  navigate,
  createTab,
  deleteTab,
}) => {
  useHotkey("ctrl+t", () => createTab());

  useHotkey("ctrl+w", () => deleteTab(activeTabId));

  useHotkey("ctrl+l", () => setEditingTabId(activeTabId));

  return (
    <div className="h-full w-full">
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
              key={tab.id}
              tab={tab}
              setTabs={setTabs}
              activeTabId={activeTabId}
              setActiveTabId={setActiveTabId}
              editingTabId={editingTabId}
              setEditingTabId={setEditingTabId}
              navigate={navigate}
              deleteTab={deleteTab}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
