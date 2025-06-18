import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
  // Framework settings
  modules: ["@wxt-dev/module-react"],
  webExt: {
    disabled: true,
  },
  // Relative to project root
  publicDir: "static",

  // Relative to srcDir
  entrypointsDir: "pages",
  vite: () => ({
    plugins: [tailwindcss()],
  }),

  // Manifest overrides
  manifest: {
    permissions: ["storage", "activeTab"],
    host_permissions: ["<all_urls>"],
  },
})
