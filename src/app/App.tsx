import { RouterProvider } from "react-router/dom";

import { Outlet } from "react-router";

import { createRouter } from "./routes/index";
//Подключение глобальных стилей к проекту
import "./styles/index";
import { NavBar } from "./ui/index";

function Layout() {
  return (
    <div style={{ display: "flex" }}>
      <NavBar></NavBar>
      <Outlet></Outlet>
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider router={createRouter(<Layout></Layout>)}></RouterProvider>
  );
}
