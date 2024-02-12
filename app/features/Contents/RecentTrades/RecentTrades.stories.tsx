import { getInitialState, useStore } from "@/stores/root";
import { Meta, Story } from "@storybook/react";

import { RecentTrades } from "./RecentTrades";
import { getRecentPositions } from "@/v2-integration/getPositions";
import { providers } from "ethers";

export default {
  title: "features/Contents/RecentTrades",
  component: RecentTrades,
} as Meta<typeof RecentTrades>;
const provider = new providers.Web3Provider(window.ethereum as any);
const createStore = () => {
  const store = getInitialState();

  getRecentPositions().then((positions)=> {
    store.recentPositions.list = positions
  })
  
  useStore.setState(store);
};

const Template: Story<typeof RecentTrades> = (args) => {
  return <RecentTrades {...args} />;
};

export const Default = Template.bind({});
Default.decorators = [
  (Story) => {
    createStore();
    return <Story />;
  },
];
