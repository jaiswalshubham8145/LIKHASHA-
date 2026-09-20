import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";

export default defineConfig(({ command }) => ({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
    ...(command === "build"
      ? [
          nitro({
            defaultPreset: process.env["VERCEL"]
              ? "vercel"
              : "cloudflare-module",
          }),
        ]
      : []),
  ],
  server: {
    port: 5000,
    strictPort: false,
  },
}));
