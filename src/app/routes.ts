import * as React from "react";
import { createBrowserRouter } from "react-router";
import { Book } from "./pages/Book";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { MeetHosts } from "./pages/MeetHosts";
import { GuestInformation } from "./pages/GuestInfo";
import { DashboardComplete as Dashboard } from "./pages/DashboardComplete";
import { OwnerLogin } from "./pages/OwnerLogin";
import { BookingConfirmation } from "./pages/BookingConfirmation";
import { CheckoutPage } from "./pages/Checkout";
import { CartPage } from "./pages/Cart";
import { Terms } from "./pages/Terms";
import { PrivacyPolicy } from "./pages/Privacy";
import { RefundPolicy } from "./pages/Refund";
import { ImageMapper } from "./pages/ImageMapper";
import { SimpleImageTest } from "./pages/SimpleImageTest";
import { Maintenance } from "./pages/Maintenance";
import { CreateBookingsUser } from "./pages/CreateBookingsUser";
import { ResetPassword } from "./pages/ResetPassword";
import { ViewLatestBooking } from "./pages/ViewLatestBooking";
import { HealthCheck } from "./pages/HealthCheck";
import { TestEmails } from "./pages/TestEmails";
import { StripeAccountCheck } from "./pages/StripeAccountCheck";
import { ResendConfirmation } from "./pages/ResendConfirmation";
import { BookingPaymentLookup } from "./pages/BookingPaymentLookup";
import { StripeInfo } from "./pages/StripeInfo";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";

// MAINTENANCE MODE
// Set to true to show maintenance page for all routes
const MAINTENANCE_MODE = false;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MAINTENANCE_MODE ? Maintenance : Root,
    children: MAINTENANCE_MODE ? undefined : [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "meet-hosts", Component: MeetHosts },
      { path: "guest-info", Component: GuestInformation },
      { path: "blog", Component: Blog },
      { path: "blog/:slug", Component: BlogPost },
      { path: "book", Component: Book },
      { path: "cart", Component: CartPage },
      { path: "checkout", Component: CheckoutPage },
      { path: "booking-success", Component: BookingConfirmation },
      { path: "dashboard", Component: Dashboard },
      { path: "owner-login", Component: OwnerLogin },
      { path: "reset-password", Component: ResetPassword },
      { path: "terms", Component: Terms },
      { path: "privacy", Component: PrivacyPolicy },
      { path: "refund", Component: RefundPolicy },
      { path: "image-mapper", Component: ImageMapper },
      { path: "image-test", Component: SimpleImageTest },
      { path: "create-bookings-user", Component: CreateBookingsUser },
      { path: "view-latest-booking", Component: ViewLatestBooking },
      { path: "health-check", Component: HealthCheck },
      { path: "test-emails", Component: TestEmails },
      { path: "stripe-account-check", Component: StripeAccountCheck },
      { path: "resend-confirmation", Component: ResendConfirmation },
      { path: "payment-lookup", Component: BookingPaymentLookup },
      { path: "stripe-info", Component: StripeInfo },
    ],
  },
  // Catch-all route for maintenance mode
  ...(MAINTENANCE_MODE ? [{ path: "*", Component: Maintenance }] : []),
]);