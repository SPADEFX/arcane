import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";
import cssContent from "../components/extracted-ff.css?raw";
import htmlContent from "../components/extracted-ff.html?raw";

function FfPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!ref.current || loaded) return;
    const shadow = ref.current.attachShadow({ mode: "open" });
    shadow.innerHTML = "<style>" + cssContent + "</style>" + htmlContent;
    setLoaded(true);
  }, [loaded]);

  return <div ref={ref} style={{ width: "100%" }} />;
}

const meta = {
  title: "Extracted/Ff",
  component: FfPreview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FfPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
