import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  plugins: [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      server: { entry: "server" },
    }),
    ...(command === "build"
      ? [
          nitro({
            defaultPreset: process.env.VERCEL ? "vercel" : "cloudflare-module",
          }),
        ]
      : []),
  ],
  server: {
    port: 5000,
    strictPort: false,
  },
}));
