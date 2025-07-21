import { useEffect } from "react";

/**
 * Runs `handler` whenever the user presses the given shortcut
 * while the current window has focus.
 */
export function useHotkey(
  combo: (e: KeyboardEvent) => boolean,
  handler: () => void,
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (combo(e)) {
        e.preventDefault(); // stop default browser action if needed
        handler();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [combo, handler]);
}
