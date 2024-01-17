import { getInitialState, useStore } from "@/stores/root";
import { Meta, Story } from "@storybook/react";

import { Notifications } from "./Notifications";

import { positions } from "@/__mocks__/positionsMock";
import { getPositions } from "@/v2-integration/getPositions";

export default {
  title: "features/Heading/Notifications",
  component: Notifications,
} as Meta<{ mockEmpty: boolean }>;

const createStore = (empty: boolean) => {
  const store = getInitialState();

  const marketsList = {
    Crypto: {
      BTCUSDC: "0x0",
      AVAXUSDC: "0xe5639cbb02ec3bd65c77e128b0c7350aeefb2bd1",
      ETHUSDC: "0x652455f5aA89C726C616383D75E7ed2ABE689FD4",
    },
  };

  store.markets.list = marketsList;
  store.markets.ready = true;
  store.connection = {
    ...store.connection,
    active: true,
  };
  useStore.setState(store);
  !empty && getPositions().then((positions) => {
    useStore.getState().userPositions.setPositions(positions);
  })
};

const Template: Story = (args) => <Notifications {...args} />;

export const Default = Template.bind({});
Default.decorators = [
  (Story) => {
    createStore(false);
    return <Story />;
  },
];

export const Empty = Template.bind({});
Empty.decorators = [
  (Story) => {
    createStore(true);
    return <Story />;
  },
];
