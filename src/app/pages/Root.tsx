import React from "react";
import { Outlet, useLocation } from "react-router";
import { ScrollToTop } from "../components/ScrollToTop";
import { ThemePreviewToggle } from "../components/ThemePreviewToggle";
import { trackPageView } from "../lib/analytics";

export function Root() {
  const location = useLocation();

  // Track page views on route change
  React.useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#F4F1EA]">
      <ScrollToTop />
      <Outlet />
      {/* Preview branch only — see ThemePreviewToggle. */}
      <ThemePreviewToggle />
    </div>
  );
}