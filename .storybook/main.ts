import type { StorybookConfig } from "@storybook/react-vite";
import path from "path";

const config: StorybookConfig = {
  stories: ["../ui-library/stories/**/*.stories.tsx"],
  staticDirs: ["../public"],
  addons: ["@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      "@uilibrary/ui/components": path.resolve(__dirname, "../ui-library/components"),
      "@uilibrary/ui/sections": path.resolve(__dirname, "../ui-library/sections"),
      "@uilibrary/ui": path.resolve(__dirname, "../ui-library/index.ts"),
      "@uilibrary": path.resolve(__dirname, "../ui-library"),
      "@": path.resolve(__dirname, "../src"),
    };
    return config;
  },
};

export default config;
