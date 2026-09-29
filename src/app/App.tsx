import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { NavBar } from "./NavBar";

import { Home, Struct } from "~/pages/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: Home(),
  },
  {
    path: "/struct",
    element: Struct(),
  },
]);

export default function App() {
  return (
    <div style={{ display: "flex" }}>
      <NavBar></NavBar>
      <RouterProvider router={router}></RouterProvider>
    </div>
  );
}
