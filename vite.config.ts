import type { UserConfigFn } from "vite";
import { overrideVaadinConfig } from "./vite.generated";
import tailwindcss from "@tailwindcss/vite";

const customConfig: UserConfigFn = (_env) => ({
  plugins: [tailwindcss()],
});

export default overrideVaadinConfig(customConfig);
