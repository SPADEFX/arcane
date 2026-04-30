import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";
import cssContent from "../components/extracted-darkos.css?raw";
import htmlContent from "../components/extracted-darkos.html?raw";

function DarkosPreview() {
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
  title: "Extracted/Darkos",
  component: DarkosPreview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DarkosPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
