import { Box, Button } from "@mui/material";
import { useState } from "react";

import { useStore } from "@/stores/root";
import { getSidebarNotifications } from "@/stores/slices/notifications";
import { useToken } from "@/hooks/contracts";

import { ButtonBar } from "./ButtonBar";
import { Notifications, Selections } from "./ButtonBar/types";
import { Drawer } from "./Drawer";
import { containerStyle } from "./MenuBar.styles";

export const MenuBar = () => {
  const [selected, setSelected] = useState<Selections | null>(null);
  const sidebarNotifications = useStore(getSidebarNotifications);
  const { chainId, active } = useStore((state) => state.connection);
  const { mintToken, getTokenBalance, loading } = useToken();
  const { getNotificationsHistoryStats } = useStore(
    (state) => state.userPositions
  );
  const stats = getNotificationsHistoryStats();
  const notificationKind = stats.unread
    ? Notifications.unread
    : stats.populated
    ? Notifications.active
    : Notifications.inactive;

  const handleGetEthClick = () => {
    window.open(
      "https://faucet.quicknode.com/optimism/goerli",
      "_blank"
    );
  };

  const handleGetUsdcClick = () => {
    window.open(
      "https://faucet.circle.com/",
      "_blank"
    );
  };

  return (
    <Box sx={containerStyle}>
      <Button
        variant="text"
        size="medium"
        disabled={!active || loading}
        onClick={handleGetUsdcClick}
      >
        Get USDC
      </Button>
      <Button
        variant="text"
        size="medium"
        disabled={!active}
        onClick={handleGetEthClick}
      >
        Get ETH
      </Button>

      <ButtonBar
        selected={selected}
        onSelect={setSelected}
        notification={notificationKind}
        networkId={chainId}
      />
      <Drawer
        selected={selected}
        AlertNotificationProps={sidebarNotifications}
        onClose={() => setSelected(null)}
      />
    </Box>
  );
};
