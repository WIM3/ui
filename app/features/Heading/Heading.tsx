/* istanbul ignore file */
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import Image from "next/image";

import { appBarStyle, logoStyle, logoTextStyle, toolBarStyle } from "./Heading.styles";
import { MenuBar } from "./MenuBar";

export const Heading = () => {
  return (
    <AppBar sx={appBarStyle}>
      <Toolbar sx={toolBarStyle}>
        <Box sx={logoStyle}>
          <Image src="/static/logo.svg" alt="App Logo" height={33} width={33} />
          <Typography sx={logoTextStyle}>Traders Island</Typography>
        </Box>
        <MenuBar />
      </Toolbar>
    </AppBar>
  );
};
