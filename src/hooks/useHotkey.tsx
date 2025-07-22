import { useEffect, useMemo } from "react";

const handlerMap = new Map<string, () => void>();
let isListenerAttached = false;

export function useHotkey(combo: string, handler: () => void) {
  const id = combo.toLowerCase();

  useEffect(() => {
    handlerMap.set(id, handler);

    // Attach global listener once
    if (!isListenerAttached) {
      window.electron.hotkeys.onHotkey((firedId) => {
        const fn = handlerMap.get(firedId);
        if (fn) fn();
      });
      isListenerAttached = true;
    }

    return () => {
      handlerMap.delete(id);
      // Do not remove the global listener; just shrink the map
    };
  }, [combo, handler]);
}
