import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // host: true -> bisa dibuka dari HP di WiFi yang sama
  server: { host: true, port: 5173 },
});
