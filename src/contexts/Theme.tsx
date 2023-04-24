/* eslint-disable */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
  type Shadows,
} from "@mui/material/styles";
import { type PaletteMode } from "@mui/material";

import useLocalStorage from "../hooks/common/useLocalStorage";

export interface IThemeContext {
  isDark: boolean | undefined;
  toggleColorMode: () => void;
}

export const ThemeContext = createContext<IThemeContext>({
  isDark: false,
  toggleColorMode: () => {},
});

export const useTheme = (): IThemeContext => {
  return useContext(ThemeContext);
};

const DARK = "dark";
const LIGHT = "light";

const ThemeProvider = ({ children }: { children: JSX.Element }) => {
  //   const isPrefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [isLocalDark, setIsLocalDark] = useLocalStorage<boolean>(
    "isDark",
    true //false
  );
  const [isDark, setIsDark] = useState<boolean | undefined>(isLocalDark);

  const [mode, setMode] = useState<PaletteMode>(DARK); // LIGHT

  const toggleColorMode = () => {
    setIsDark((prev) => !prev);
    setIsLocalDark((prev) => !prev);
  };
  useEffect(() => {
    setMode(isDark ? DARK : LIGHT);
  }, [isDark]);

  const createThemeHelper = useCallback((mode: PaletteMode) => {
    const themeColors = {
      info: {
        main: "#0F71F2",
      },
      success: {
        main: "#03A64A",
      },
      warning: {
        main: "#F28C0F",
      },
      error: {
        main: "#F20F0F",
      },
      primary: {
        main: "#4BB39A", // rmb to change `accentColor` in Wallet.tsx as well
      }, // ref: https://colorhunt.co/palettes/teal-gold
      secondary: {
        main: "#F1B24B", // "#433865" // "#22f291" // "#0CF2C8" // "#706c97"
      },
    };

    return createTheme({
      palette: {
        mode,
        ...(mode === LIGHT
          ? {
              background: {
                paper: "#F0F1F5",
                default: "#F0F1F5",
              },
              backgroundTwo: {
                main: "#FFFFFF",
              },
              //   primaryLighter: {
              //     main: "#F384DF",
              //   },

              ...themeColors,
            }
          : {
              background: {
                paper: "#22272E",
                default: "#22272E",
              },
              backgroundTwo: {
                main: "#2D333B",
              },
              //   primaryLighter: {
              //     main: "#8F2A5F", // #F5C3DC
              //   },
              ...themeColors,
            }),
      },
      shadows: Array(25).fill("none") as Shadows,
    });
  }, []);

  const muiTheme = useMemo(
    () => createThemeHelper(mode),
    [mode, createThemeHelper]
  );

  const colorMode = {
    isDark,
    toggleColorMode,
  };

  return (
    <ThemeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;

// ref: https://mui.com/material-ui/customization/palette/#adding-new-colors
declare module "@mui/material/styles" {
  interface Palette {
    backgroundTwo: Palette["primary"];
    // primaryLighter: Palette["primary"];
  }
  interface PaletteOptions {
    backgroundTwo: PaletteOptions["primary"];
    // primaryLighter: PaletteOptions["primary"];
  }
}

// declare module "@mui/material/Button" {
//   interface ButtonPropsColorOverrides {
//     backgroundTwo: true;
//   }
// }
