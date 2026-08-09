import { Outlet } from "react-router";
import { NavBar } from "./NavBar";

export function RootLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
