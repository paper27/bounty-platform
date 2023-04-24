/* eslint-disable */
import "@rainbow-me/rainbowkit/styles.css";

import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { createContext, useContext, useMemo, ReactNode } from "react";
import { useTheme } from "./Theme";

import {
  connectorsForWallets,
  RainbowKitProvider,
  type Theme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
  coinbaseWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

import { WALLET_CONNECT_ID, APP_NAME } from "~/common/constants";

import { env } from "~/env.mjs";

export interface IWalletContext {}

export const WalletContext = createContext<IWalletContext>({});

export const useWallet = (): IWalletContext => {
  return useContext(WalletContext);
};

// const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
//   <Text>
//     By connecting your wallet, you agree to the{" "}
//     <Link href="https://termsofservice.xyz">Terms of Service</Link> and
//     acknowledge you have read and understand the protocol{" "}
//     <Link href="https://disclaimer.xyz">Disclaimer</Link>
//   </Text>
// );

// custom avatar (ens avatar): https://www.rainbowkit.com/docs/custom-avatars

// mui w/ SSR: https://mui.com/material-ui/guides/server-rendering/#main-content
// mui w/ SSR: https://dev.to/hajhosein/nextjs-mui-v5-typescript-tutorial-and-starter-3pab

const WalletProvider = ({
  children,
  session,
}: {
  children: ReactNode;
  session: Session | null;
}) => {
  const { chains, provider } = configureChains(
    [polygonMumbai],
    [
      alchemyProvider({
        apiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY_CLIENT,
      }), // TODO: key exposed, make sure whitelist on alchemy dashboard!!
      publicProvider(),
    ]
  );

  const connectors = connectorsForWallets([
    {
      groupName: "Popular",
      wallets: [
        metaMaskWallet({ chains: chains }),
        coinbaseWallet({ appName: APP_NAME, chains: chains }),
        walletConnectWallet({ chains: chains }), // , projectId: WALLET_CONNECT_ID // TODO: must verify projectId by officially submitting request in wc dashboard
      ],
    },
  ]);

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  const { isDark } = useTheme();
  const color = useMemo(() => {
    return isDark
      ? {
          accentColorForeground: "#FFF",
          actionButtonBorder: "rgba(255, 255, 255, 0.04)",
          actionButtonBorderMobile: "rgba(255, 255, 255, 0.08)",
          actionButtonSecondaryBackground: "rgba(255, 255, 255, 0.08)",
          closeButton: "rgba(224, 232, 255, 0.6)",
          closeButtonBackground: "rgba(255, 255, 255, 0.08)",
          connectButtonBackground: "#1A1B1F",
          connectButtonBackgroundError: "#FF494A",
          connectButtonInnerBackground:
            "linear-gradient(0deg, rgba(255, 255, 255, 0.075), rgba(255, 255, 255, 0.15))",
          connectButtonText: "#FFF",
          connectButtonTextError: "#FFF",
          connectionIndicator: "#30E000",
          downloadBottomCardBackground:
            "linear-gradient(126deg, rgba(0, 0, 0, 0) 9.49%, rgba(120, 120, 120, 0.2) 71.04%), #1A1B1F",
          downloadTopCardBackground:
            "linear-gradient(126deg, rgba(120, 120, 120, 0.2) 9.49%, rgba(0, 0, 0, 0) 71.04%), #1A1B1F",
          error: "#FF494A",
          generalBorder: "rgba(255, 255, 255, 0.08)",
          generalBorderDim: "rgba(255, 255, 255, 0.04)",
          menuItemBackground: "rgba(224, 232, 255, 0.1)",
          modalBackdrop: "rgba(0, 0, 0, 0.5)",
          modalBackground: "#1A1B1F",
          modalBorder: "rgba(255, 255, 255, 0.08)",
          modalText: "#FFF",
          modalTextDim: "rgba(224, 232, 255, 0.3)",
          modalTextSecondary: "rgba(255, 255, 255, 0.6)",
          profileAction: "rgba(224, 232, 255, 0.1)",
          profileActionHover: "rgba(224, 232, 255, 0.2)",
          profileForeground: "rgba(224, 232, 255, 0.05)",
          selectedOptionBorder: "rgba(224, 232, 255, 0.1)",
          standby: "#FFD641",
        }
      : {
          accentColorForeground: "#1A1B1F",
          actionButtonBorder: "rgba(0, 0, 0, 0.04)",
          actionButtonBorderMobile: "rgba(0, 0, 0, 0.06)",
          actionButtonSecondaryBackground: "rgba(0, 0, 0, 0.06)",
          closeButton: "rgba(60, 66, 66, 0.8)",
          closeButtonBackground: "rgba(0, 0, 0, 0.06)",
          connectButtonBackground: "#FFF",
          connectButtonBackgroundError: "#FF494A",
          connectButtonInnerBackground:
            "linear-gradient(0deg, rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.06))",
          connectButtonText: "#25292E",
          connectButtonTextError: "#FFF",
          connectionIndicator: "#30E000",
          downloadBottomCardBackground:
            "linear-gradient(126deg, rgba(255, 255, 255, 0) 9.49%, rgba(171, 171, 171, 0.04) 71.04%), #FFFFFF",
          downloadTopCardBackground:
            "linear-gradient(126deg, rgba(171, 171, 171, 0.2) 9.49%, rgba(255, 255, 255, 0) 71.04%), #FFFFFF",
          error: "#FF494A",
          generalBorder: "rgba(0, 0, 0, 0.06)",
          generalBorderDim: "rgba(0, 0, 0, 0.03)",
          menuItemBackground: "rgba(60, 66, 66, 0.1)",
          modalBackdrop: "rgba(0, 0, 0, 0.3)",
          modalBackground: "#FFF",
          modalBorder: "transparent",
          modalText: "#25292E",
          modalTextDim: "rgba(60, 66, 66, 0.3)",
          modalTextSecondary: "rgba(60, 66, 66, 0.6)",
          profileAction: "#FFF",
          profileActionHover: "rgba(255, 255, 255, 0.5)",
          profileForeground: "rgba(60, 66, 66, 0.06)",
          selectedOptionBorder: "rgba(60, 66, 66, 0.1)",
          standby: "#FFD641",
        };
  }, [isDark]);
  const radiusScales = useMemo(() => {
    return {
      large: {
        actionButton: "9999px",
        connectButton: "12px",
        modal: "24px",
        modalMobile: "28px",
      },
      medium: {
        actionButton: "10px",
        connectButton: "8px",
        modal: "16px",
        modalMobile: "18px",
      },
      none: {
        actionButton: "0px",
        connectButton: "0px",
        modal: "0px",
        modalMobile: "0px",
      },
      small: {
        actionButton: "4px",
        connectButton: "4px",
        modal: "8px",
        modalMobile: "8px",
      },
    };
  }, []);
  const borderRadius = "large";
  const systemFontStack =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
  const fontStacks = useMemo(() => {
    return {
      rounded: `SFRounded, ui-rounded, "SF Pro Rounded", ${systemFontStack}`,
      system: systemFontStack,
    };
  }, []);
  const customTheme: Theme = useMemo(() => {
    return {
      blurs: {
        modalOverlay: "blur(0px)",
      },
      colors: {
        accentColor: "#4BB39A",
        ...color,
      },
      fonts: {
        body: fontStacks["rounded"],
      },
      radii: {
        actionButton: radiusScales[borderRadius].actionButton,
        connectButton: radiusScales[borderRadius].connectButton,
        menuButton: radiusScales[borderRadius].connectButton,
        modal: radiusScales[borderRadius].modal,
        modalMobile: radiusScales[borderRadius].modalMobile,
      },
      shadows: {
        connectButton: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        dialog: "0px 8px 32px rgba(0, 0, 0, 0.32)",
        profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.04)",
        selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.24)",
        selectedWallet: isDark
          ? "0px 2px 6px rgba(0, 0, 0, 0.24)"
          : "0px 2px 6px rgba(0, 0, 0, 0.12)",
        walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.16)",
      },
    };
  }, [isDark, radiusScales, fontStacks, color]);

  const contextProvider = {};

  // const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
  //   <Text>
  //     By connecting your wallet, you agree to the{" "}
  //     <Link href="https://termsofservice.xyz">Terms of Service</Link> and
  //     acknowledge you have read and understand the protocol{" "}
  //     <Link href="https://disclaimer.xyz">Disclaimer</Link>
  //   </Text>
  // );
  return (
    <WagmiConfig client={wagmiClient}>
      <WalletContext.Provider value={contextProvider}>
        <SessionProvider session={session}>
          <RainbowKitProvider
            appInfo={{
              appName: APP_NAME,
              // disclaimer: Disclaimer,
            }}
            chains={chains}
            theme={customTheme}
          >
            {children}
          </RainbowKitProvider>
        </SessionProvider>
      </WalletContext.Provider>
    </WagmiConfig>
  );
};

export default WalletProvider;
