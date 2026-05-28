import { RouterConfigurationBuilder } from "@vaadin/hilla-file-router/runtime.js";
import Flow from "Frontend/generated/flow/Flow";
import fileRoutes from "Frontend/generated/file-routes.js";

export const { router, routes } = new RouterConfigurationBuilder()
  .withFileRoutes(fileRoutes)
  .withReactRoutes([
    {
      path: "",
      lazy: async () => {
        const { default: Component, loader } = await import("./views/@index");
        return { Component, loader };
      },
    },
    {
      path: "rules",
      lazy: async () => {
        const { default: Component, loader } = await import("./views/rules");
        return { Component, loader };
      },
    },
  ])
  .withFallback(Flow)
  .protect()
  .build();
