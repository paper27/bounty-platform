// import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// import { ROUTE_ROOM } from "../constants/common";

const useScreenSize = () => {
  //   const router = useRouter();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSlim = useMediaQuery(theme.breakpoints.between("sm", "lg"));
  const isWide = useMediaQuery(theme.breakpoints.up("lg"));

  //   const isRoomPage = "/" + router.pathname.split("/").at(1) === ROUTE_ROOM;

  //   const isWidePage = false; //isRoomPage; // || isTestPage;

  return {
    isMobile,
    isSlim,
    isWide,
    // isWidePage,
  };
};

export default useScreenSize;
// ref: https://mui.com/material-ui/customization/breakpoints/

// old ref below:

// import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { type Breakpoint } from "@mui/material";

// const useResponsive = (
//   query: string,
//   key?: Breakpoint,
//   start?: Breakpoint,
//   end?: Breakpoint
// ) => {
//   const theme = useTheme();

//   const mediaUp = useMediaQuery(theme.breakpoints.up(key ? key : "xs"));
//   const mediaDown = useMediaQuery(theme.breakpoints.down(key ? key : "xs"));
//   const mediaBetween = useMediaQuery(
//     theme.breakpoints.between(start ? start : "xs", end ? end : "xs")
//   );
//   const mediaOnly = useMediaQuery(theme.breakpoints.only(key ? key : "xs"));

//   if (query === "up") {
//     return mediaUp;
//   }

//   if (query === "down") {
//     return mediaDown;
//   }

//   if (query === "between") {
//     return mediaBetween;
//   }

//   if (query === "only") {
//     return mediaOnly;
//   }
//   return null;
// };
