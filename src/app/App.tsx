import { createBrowserRouter, Outlet } from "react-router";
import { RouterProvider } from "react-router/dom";

import { NavBar } from "./NavBar";

import { Home, Struct } from "~/pages/index";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "struct", element: <Struct /> },
    ],
  },
]);

function Layout() {
  return (
    <div style={{ display: "flex" }}>
      <NavBar></NavBar>
      <Outlet></Outlet>
    </div>
  );
}

export default function App() {
  return <RouterProvider router={router}></RouterProvider>;
}
