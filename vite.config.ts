import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import vike from "vike/plugin";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./"),
    }
  },
  plugins: [react({ babel: { plugins: [['styled-jsx/babel', { "optimizeForSpeed": true }]] } }), vike({})],
  
});
