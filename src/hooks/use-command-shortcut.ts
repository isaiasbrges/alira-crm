"use client";

import * as React from "react";

/** Dispara o callback em Ctrl/Cmd + a tecla informada. */
export function useCommandShortcut(key: string, onTrigger: () => void) {
  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (!event.metaKey && !event.ctrlKey) return;

      event.preventDefault();
      onTrigger();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [key, onTrigger]);
}
