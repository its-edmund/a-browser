import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";

export interface AddressBarProps {
  /** Current page URL (kept in App state) */
  url: string;
  /** Called when user hits Enter or presses Go */
  onNavigate: (url: string) => void;
  /** Browser control callbacks */
  onBack?: () => void;
  onForward?: () => void;
  onReload?: () => void;
  /** Whether back / forward are currently possible */
  canGoBack?: boolean;
  canGoForward?: boolean;
}

const AddressBar: React.FC<AddressBarProps> = ({
  url,
  onNavigate,
  onBack,
  onForward,
  onReload,
  canGoBack,
  canGoForward,
}) => {
  const [value, setValue] = useState(url);

  /* keep local field in sync when parent updates url */
  useEffect(() => setValue(url), [url]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onNavigate(/^[a-z]+:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-800 text-white">
      {/* Back */}
      <button
        className="p-1 disabled:opacity-30"
        onClick={onBack}
        disabled={!canGoBack}
        title="Back"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Forward */}
      <button
        className="p-1 disabled:opacity-30"
        onClick={onForward}
        disabled={!canGoForward}
        title="Forward"
      >
        <ArrowRight size={18} />
      </button>

      {/* Reload */}
      <button className="p-1" onClick={onReload} title="Reload">
        <RotateCcw size={18} />
      </button>

      {/* URL field */}
      <input
        className="flex-1 p-1 rounded text-black outline-none"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
        onClick={submit}
      >
        Go
      </button>
    </div>
  );
};

export default AddressBar;
