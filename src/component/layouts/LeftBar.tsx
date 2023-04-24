// import Image from "next/image";

import { useRouter } from "next/router";
import { useTheme } from "../../contexts/Theme";

import Stack from "@mui/material/Stack";
import Drawer from "@mui/material/Drawer";
import ButtonBase from "@mui/material/ButtonBase";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import HomeOutline from "../icons/HomeOutline";
import CreateOutline from "../icons/CreateOutline";
import PersonOutline from "../icons/PersonOutline";
import MoonOutline from "../icons/MoonOutline";
import SunOutline from "../icons/SunOutline";

import { HEIGHT_HEADER } from "./Header";

// import logo3 from "../../assets/logo3_crop.png";

import { useAppStates } from "~/contexts/AppStates";
import useScreenSize from "~/hooks/app/useScreenSize";

export const WIDTH_LEFT_BAR = 260;

const LeftBar = () => {
  const { pathname, push: navigateTo } = useRouter();
  const { isOpenLeftBar, setIsOpenLeftBar } = useAppStates();
  const { isWide } = useScreenSize();
  const { isDark, toggleColorMode } = useTheme();
  return (
    <Drawer
      open={isOpenLeftBar}
      onClose={() => {
        setIsOpenLeftBar(false);
      }}
      variant={isWide ? "persistent" : "temporary"} // "temporary"
      PaperProps={{ sx: { width: WIDTH_LEFT_BAR } }}
    >
      <Stack justifyContent="space-between" sx={{ height: "100vh", py: 2 }}>
        <Stack spacing={3}>
          <Stack
            alignItems="center"
            justifyContent="center"
            height={HEIGHT_HEADER}
          >
            <ButtonBase
              onClick={async () => {
                await navigateTo("/");
              }}
            >
              {/* <Image
                src={logo3} //{isSlim ? logo3 : logo5}
                alt="logo"
                width={35} //{isSlim ? 35 : 190}
                height={35} //{isSlim ? 35 : 50}
                priority={true}
              /> */}
              EpicBounties DEMO
            </ButtonBase>
          </Stack>

          <Stack>
            <List>
              <ListItem selected={pathname === "/"}>
                <ListItemButton
                  onClick={async () => {
                    await navigateTo("/");
                  }}
                >
                  <ListItemIcon>{<HomeOutline />}</ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </ListItem>

              <ListItem selected={pathname === "/create-bounty"}>
                <ListItemButton
                  onClick={async () => {
                    await navigateTo("/create-bounty");
                  }}
                >
                  <ListItemIcon>{<CreateOutline />}</ListItemIcon>
                  <ListItemText primary="Create Bounty" />
                </ListItemButton>
              </ListItem>

              {/* <ListItem selected={pathname === "/my-profile"}>
                <ListItemButton
                  onClick={async () => {
                    await navigateTo("/my-profile");
                  }}
                >
                  <ListItemIcon>{<PersonOutline />}</ListItemIcon>
                  <ListItemText primary={"My Profile"} />
                </ListItemButton>
              </ListItem> */}
            </List>
          </Stack>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ height: 50 }}
        >
          <IconButton
            onClick={() => {
              toggleColorMode();
            }}
          >
            {isDark ? <MoonOutline /> : <SunOutline />}
          </IconButton>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default LeftBar;

// get icons first choice: https://ionic.io/ionicons
// get icons second choice: https://jam-icons.com/
