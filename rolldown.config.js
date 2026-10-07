import { defineConfig } from "rolldown";
import { resolve } from "path";

const isDev = process.env.NODE_ENV !== "production";

// mydebug 擴充的路徑，搬家時只改這一行
const MYDEBUG_DIR = resolve("../mydebug");

export default defineConfig({
  input: "src/index.js",
  resolve: {
    alias: {
      "src":     resolve("./src"),
      "filters": resolve("./src/filters"),
      "utils":   MYDEBUG_DIR,
    },
  },
  plugins: [
    {
      name: "replace-debug",
      transform(code) {
        return code.replaceAll("__DEBUG__", isDev ? "true" : "false");
      },
    },
  ],
  output: {
    file: "content.js",
    format: "iife",
    minify: !isDev,
  },
});
