import * as React from "react";

/**
 * PREVIEW-ONLY control. Flips <html data-theme> between the live brand and the
 * Japandi proposal so the two can be compared on the same URL, on real content,
 * rather than from screenshots.
 *
 * This component exists on the preview branch only and is not intended to ship.
 * The default is the live brand, so a first-time visitor sees today's site.
 */
const STORAGE_KEY = "oe-theme-preview";

export function ThemePreviewToggle() {
  const [theme, setTheme] = React.useState<"brand" | "japandi">("brand");

  React.useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Private browsing or blocked storage — fall back to the live brand.
    }
    if (saved === "japandi") setTheme("japandi");
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === "japandi") root.setAttribute("data-theme", "japandi");
    else root.removeAttribute("data-theme");
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Persistence is a convenience; the toggle still works without it.
    }
  }, [theme]);

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[9999] -translate-x-1/2 print:hidden"
      role="group"
      aria-label="Preview theme"
    >
      <div className="flex items-center gap-1 rounded-full border border-black/10 bg-white/85 p-1 shadow-lg backdrop-blur-md">
        <span className="px-3 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
          Preview
        </span>
        {([
          { id: "brand", label: "Current" },
          { id: "japandi", label: "Japandi" },
        ] as const).map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setTheme(option.id)}
            aria-pressed={theme === option.id}
            className={`min-h-9 rounded-full px-4 text-[10px] font-bold uppercase tracking-[0.16em] transition-colors ${
              theme === option.id
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-black/5"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
