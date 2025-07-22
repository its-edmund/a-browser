import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";

import { useHotkey } from "../hooks/useHotkey";
import { nanoid } from "nanoid";
import { Plus, X, ArrowLeft, ArrowRight } from "lucide-react";

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
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    setEditingTabId(tab.id);
  };

  const handleBlur = () => {
    // Check if the focus moved outside the form
    if (formRef.current && !formRef.current.contains(document.activeElement)) {
      setEditingTabId(null);
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
          ref={formRef}
          className="flex flex-row flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("submit");
            navigate(tab.id, url);
            setEditingTabId(null);
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <input
            ref={inputRef}
            className="outline-none w-full"
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Search or Go..."
            onFocus={handleFocus}
            onBlur={handleBlur}
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
  goForward,
  goBack,
  canGoForward,
  canGoBack,
}) => {
  useHotkey("ctrl+t", () => createTab());

  useHotkey("ctrl+w", () => deleteTab(activeTabId));

  useHotkey("ctrl+l", () => setEditingTabId(activeTabId));

  return (
    <div className="h-full w-full">
      <div
        className="h-[40px] w-full flex flex-row items-center px-4 pl-[76px]"
        style={{ WebkitAppRegion: "drag" }}
      >
        <div className="flex flex-row justify-between items-center flex-1">
          <div
            className="flex flex-row flex-1 items-center"
            style={{ WebkitAppRegion: "no-drag" }}
          >
            <Button
              size="icon"
              variant="ghost"
              className="size-6"
              disabled={!canGoBack}
              onClick={goBack}
            >
              <ArrowLeft strokeWidth={3} size={16} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-6"
              disabled={!canGoForward}
              onClick={goForward}
            >
              <ArrowRight strokeWidth={3} size={16} />
            </Button>
          </div>
          <div
            className="flex items-center"
            style={{ WebkitAppRegion: "no-drag" }}
          >
            <Button
              size="icon"
              variant="ghost"
              className="size-6"
              onClick={() => createTab()}
            >
              <Plus size={16} strokeWidth={3} />
            </Button>
          </div>
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
