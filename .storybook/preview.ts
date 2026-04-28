import type { Preview } from "@storybook/react";
import "../ui-library/tokens/tokens.css";
import "../ui-library/tokens/fonts-base.css";
import "../src/styles/tailwind.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#09090b" },
        { name: "light", value: "#fafafa" },
      ],
    },
    layout: "centered",
  },
  decorators: [
    (Story) => {
      // Force dark mode tokens on the document
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      return Story();
    },
  ],
};

export default preview;
