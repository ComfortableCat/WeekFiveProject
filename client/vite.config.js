import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // Add page details below
        main: resolve(__dirname, "index.html"),
        projectPage: resolve(__dirname, "projectPage/index.html"),
        about: resolve(__dirname, "task/index.html"),
      },
    },
  },
});
