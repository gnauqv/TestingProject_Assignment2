import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // BASE URL của frontend dev server (Vite chạy ở 5173)
    baseUrl: "http://localhost:5173",

    // Nếu muốn disable support file (tuỳ dự án)
    supportFile: false,

    setupNodeEvents(on, config) {
      // Đây là nơi bạn có thể implement node events nếu cần
      // Ví dụ: on('task', ...) để mock hoặc logging
      return config;
    },

    // Tuỳ chọn timeout chung
    defaultCommandTimeout: 8000, // 8s để tránh fail quá sớm
    pageLoadTimeout: 10000,      // 10s load page
  },
});
