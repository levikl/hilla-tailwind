import { RouterConfigurationBuilder } from "@vaadin/hilla-file-router/runtime.js";
import Flow from "Frontend/generated/flow/Flow";
import fileRoutes from "Frontend/generated/file-routes.js";

export const { router, routes } = new RouterConfigurationBuilder()
  .withFileRoutes(fileRoutes)
  .withReactRoutes([
    loaderRoute({ path: "", importPath: "@index" }),
    loaderRoute({ path: "rules" }),
  ])
  .withFallback(Flow)
  .protect()
  .build();

type LoaderRouteProps = { path: string; importPath?: string };

function loaderRoute({ path, importPath = path }: LoaderRouteProps) {
  return {
    path,
    lazy: async () => {
      const { default: Component, loader } = await import(
        `./views/${importPath}`
      );
      return { Component, loader };
    },
  };
}
