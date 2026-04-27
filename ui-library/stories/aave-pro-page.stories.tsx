import type { Meta, StoryObj } from "@storybook/react";
import {
  HeroAavePro,
  AaveProMarkets,
  AaveProBorrow,
  AaveProSwap,
  AaveProArchitecture,
  AaveProFAQ,
  AaveProCTAFinal,
  AaveProFooter,
} from "@uilibrary/ui";

function AaveProPage() {
  return (
    <div style={{ backgroundColor: "#0f0f10" }}>
      <HeroAavePro />
      <AaveProMarkets />
      <AaveProBorrow />
      <AaveProSwap />
      <AaveProArchitecture />
      <AaveProFAQ />
      <AaveProCTAFinal />
      <AaveProFooter />
    </div>
  );
}

const meta = {
  title: "Pages/Aave Pro",
  component: AaveProPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AaveProPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullPage: Story = {};
