import type { Meta, StoryObj } from "@storybook/react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@uilibrary/ui";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: { layout: "centered" },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: "500px" }}>
      <Accordion type="single" collapsible>
        <AccordionItem value="1">
          <AccordionTrigger>What is this library?</AccordionTrigger>
          <AccordionContent>
            A personal collection of premium marketing components with
            animations, tokens, and accessibility built in.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="2">
          <AccordionTrigger>How do I customize it?</AccordionTrigger>
          <AccordionContent>
            Override the CSS custom properties in your tokens file. Change
            brand colors, radius, shadows, and the whole library adapts.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="3">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. Built on Radix Primitives with proper ARIA attributes, keyboard
            navigation, and focus management.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div style={{ width: "500px" }}>
      <Accordion type="multiple">
        <AccordionItem value="a">
          <AccordionTrigger>Can I open multiple?</AccordionTrigger>
          <AccordionContent>
            Yes! Set type="multiple" to allow multiple items open at once.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Another item</AccordionTrigger>
          <AccordionContent>
            Both this and the above can be open simultaneously.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  ),
};
