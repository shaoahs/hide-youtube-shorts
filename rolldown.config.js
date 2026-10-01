import { defineConfig } from "rolldown";
import { resolve } from "path";

export default defineConfig({
  input: "src/index.js",
  resolve: {
    alias: {
      "src": resolve("./src"),
      "filters": resolve("./src/filters"),
    },
  },
  output: {
    file: "content.js",
    format: "iife",
    minify: false,
  },
});
