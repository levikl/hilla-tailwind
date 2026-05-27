import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./routes.js";

import "./index.css";

createRoot(document.getElementById("outlet")!).render(
  <RouterProvider router={router} />,
);
