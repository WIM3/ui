import { AlertNotification, AlertNotificationProps } from "@/components";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import { Box, Drawer as MuiDrawer, Typography } from "@mui/material";

import Image from "next/image";
import { Selections } from "../ButtonBar/types";
import { containerStyle, iconStyle, titleStyle } from "./Drawer.styles";
import { Notifications } from "./Notifications";
import { Wallets } from "./Wallets";

const titleMapping = {
  [Selections.notifications]: "Notifications",
  [Selections.wallet]: "Wallets",
  [Selections.menu]: "Galleon",
};

const iconMapping = {
  [Selections.notifications]: NotificationsNoneOutlinedIcon,
  [Selections.wallet]: AccountBalanceWalletOutlinedIcon,
  [Selections.menu]: () => (
    <Image src="/static/logo.svg" width={24} height={24} alt="Galleon Logo" />
  ),
};

interface DrawerProps {
  selected: Selections | null;
  AlertNotificationProps: {
    visible?: boolean;
  } & AlertNotificationProps;
  onClose: () => void;
}

export const Drawer = ({
  selected,
  AlertNotificationProps,
  onClose,
}: DrawerProps) => {
  const IconComponent = selected ? iconMapping[selected] : () => <></>;
  const showNotification =
    AlertNotificationProps.visible && selected === Selections.wallet;
  const title = selected ? titleMapping[selected] : "";

  return (
    <MuiDrawer
      sx={containerStyle}
      anchor="right"
      open={Boolean(selected)}
      onClose={onClose}
    >
      {showNotification && (
        <AlertNotification {...AlertNotificationProps} inline />
      )}
      <Box sx={titleStyle(showNotification || false)}>
        <IconComponent sx={iconStyle} />
        <Typography variant="subtitle1">{title}</Typography>
      </Box>
      {selected === Selections.wallet && <Wallets />}
      {selected === Selections.notifications && <Notifications />}
    </MuiDrawer>
  );
};
