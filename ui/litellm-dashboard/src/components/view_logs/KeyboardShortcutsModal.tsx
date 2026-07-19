interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsModal({ open, onClose }: KeyboardShortcutsModalProps) {
  if (!open) return null;

  const shortcuts = [
    { key: "j", description: "Navigate to next log entry" },
    { key: "k", description: "Navigate to previous log entry" },
    { key: "Enter", description: "Open details drawer for focused log" },
    { key: "Esc", description: "Close drawer if open" },
    { key: "/", description: "Focus search input" },
    { key: "l", description: "Toggle live mode on/off" },
    { key: "?", description: "Show this help modal" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            {shortcuts.map(({ key, description }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <span className="text-sm text-gray-600">{description}</span>
                <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 border border-gray-300 rounded">
                  {key === "Enter" ? "↵" : key === "Esc" ? "Esc" : key}
                </kbd>
              </div>
            ))}
          </div>

          <div className="mt-6 text-xs text-gray-500 text-center">
            Press <kbd className="px-1 py-0.5 bg-gray-100 border border-gray-300 rounded">Esc</kbd> or click outside to close
          </div>
        </div>
      </div>
    </div>
  );
}
