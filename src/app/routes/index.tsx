import { type ReactElement } from "react";

import { createBrowserRouter } from "react-router";

import { Home, Struct } from "~/pages/index";

let router: ReturnType<typeof createBrowserRouter> | undefined;

export function createRouter(layoutComp: ReactElement) {
  if (!router) {
    router = createBrowserRouter([
      {
        path: "/",
        element: layoutComp,
        children: [
          { index: true, element: <Home /> },
          { path: "struct", element: <Struct /> },
        ],
      },
    ]);
  }

  return router;
}
