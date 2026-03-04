import React from "react";
import { Outlet, useLocation } from "react-router";
import { ScrollToTop } from "../components/ScrollToTop";
import { trackPageView } from "../lib/analytics";

export function Root() {
  const location = useLocation();

  // Track page views on route change
  React.useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location]);

  return (
    <div className="min-h-screen bg-[#fdfcf8]">
      <ScrollToTop />
      <Outlet />
    </div>
  );
}