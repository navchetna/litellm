import { useCallback, useEffect, useState, RefObject } from "react";

interface UseKeyboardNavProps<T> {
  data: T[];
  onSelectLog: (log: T) => void;
  onOpenDrawer: () => void;
  onCloseDrawer: () => void;
  searchInputRef: RefObject<HTMLInputElement>;
  onToggleLive: () => void;
  onShowHelp: () => void;
  isDrawerOpen: boolean;
  enabled?: boolean;
}

export function useKeyboardNav<T>({
  data,
  onSelectLog,
  onOpenDrawer,
  onCloseDrawer,
  searchInputRef,
  onToggleLive,
  onShowHelp,
  isDrawerOpen,
  enabled = true,
}: UseKeyboardNavProps<T>) {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const target = event.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      if (event.key === "Escape" && isDrawerOpen) {
        event.preventDefault();
        onCloseDrawer();
        return;
      }

      if (event.key === "?") {
        event.preventDefault();
        onShowHelp();
        return;
      }

      if (isInputFocused && event.key !== "Escape") {
        return;
      }

      switch (event.key) {
        case "j":
          event.preventDefault();
          setSelectedIndex((prev) => {
            const next = Math.min(prev + 1, data.length - 1);
            if (next >= 0 && next < data.length) {
              onSelectLog(data[next]);
            }
            return next;
          });
          break;

        case "k":
          event.preventDefault();
          setSelectedIndex((prev) => {
            const next = Math.max(prev - 1, 0);
            if (next >= 0 && next < data.length) {
              onSelectLog(data[next]);
            }
            return next;
          });
          break;

        case "Enter":
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < data.length) {
            onOpenDrawer();
          }
          break;

        case "/":
          event.preventDefault();
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
          break;

        case "l":
          event.preventDefault();
          onToggleLive();
          break;
      }
    },
    [
      data,
      selectedIndex,
      isDrawerOpen,
      onSelectLog,
      onOpenDrawer,
      onCloseDrawer,
      searchInputRef,
      onToggleLive,
      onShowHelp,
      enabled,
    ],
  );

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress, enabled]);

  useEffect(() => {
    if (selectedIndex >= 0 && selectedIndex < data.length) {
      const rowElement = document.querySelector(`[data-row-index="${selectedIndex}"]`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIndex, data.length]);

  useEffect(() => {
    if (data.length === 0) {
      setSelectedIndex(-1);
    } else if (selectedIndex >= data.length) {
      setSelectedIndex(data.length - 1);
    }
  }, [data.length, selectedIndex]);

  return { selectedIndex, setSelectedIndex };
}
