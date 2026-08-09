import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { HeroSection } from "./components/HeroSection";
import { LoginPage } from "./components/LoginPage";
import { OtpPage } from "./components/OtpPage";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { index: true, Component: HeroSection },
    ],
  },
  // Auth pages — no navbar
  { path: "/login", Component: LoginPage },
  { path: "/verify-otp", Component: OtpPage },
]);
