import { useAppStates } from "~/contexts/AppStates";
import useScreenSize from "~/hooks/app/useScreenSize";

import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";

import MenuOutline from "../icons/MenuOutline";

import { WIDTH_LEFT_BAR } from "./LeftBar";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export const HEIGHT_HEADER = 70;

const Header = () => {
  const { isOpenLeftBar, setIsOpenLeftBar } = useAppStates();
  const { isWide } = useScreenSize();
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        position: "fixed",
        height: HEIGHT_HEADER,
        width: `calc(100% - ${isOpenLeftBar && isWide ? WIDTH_LEFT_BAR : 0}px)`,
        px: 2,
        backgroundColor: "background.paper",
      }}
    >
      <IconButton
        onClick={() => {
          setIsOpenLeftBar((prev) => !prev);
        }}
      >
        <MenuOutline />
      </IconButton>
      <ConnectButton showBalance={false} />
    </Stack>
  );
};

export default Header;
