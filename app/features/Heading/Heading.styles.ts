import { Theme } from "@mui/material";

export const appBarStyle = (theme: Theme) => ({
  display: "flex",
  flexDirecrion: "row",
  position: "static",
  zIndex: "auto",
  height: "4.5rem",
  padding: theme.spacing(0, 3),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(0, 6),
  },
});

export const toolBarStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "100%",
};

export const logoStyle = {
  display: "flex",
  gap: "1rem",
  alignItems: "center",
}

export const logoTextStyle = (theme: Theme) => ({
  display: "none",
  [theme.breakpoints.up("md")]: {
    display: "block",
    fontSize: "1rem",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "1.1875rem",
  },
});