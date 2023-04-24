/* eslint-disable */
import type { Dispatch, SetStateAction } from "react";
import { polygon } from "wagmi/chains";

import { createContext, useContext, useState, useEffect } from "react";
import { useAccount, useNetwork, type Address } from "wagmi";
import { useIdleTimer } from "react-idle-timer";
// import useUpdateEffect from "~/hooks/common/useUpdateEffect";
// import useScreenSize from "~/hooks/app/useScreenSize";

import { NETWORK_CONFIG_DEFAULT, NETWORK_CONFIGS } from "~/common/constants";

export interface IAppStatesContext {
  isIdle: boolean;
  isContractInteractionAllowed: boolean;
  isOpenLeftBar: boolean;
  addressApp: Address;
  addressUSDC: Address;
  addressUSDCx: Address;
  addressGelatoTreasury: Address;
  addressSFCFAV1: Address;
  setIsOpenLeftBar: Dispatch<SetStateAction<boolean>>;
}

// export const AppStatesContext = createContext<IAppStatesContext>(
//   {} as IAppStatesContext
// );

export const AppStatesContext = createContext<IAppStatesContext>({
  isIdle: false,
  isContractInteractionAllowed: false,
  isOpenLeftBar: false,
  addressApp: NETWORK_CONFIG_DEFAULT.addrApp,
  addressUSDC: NETWORK_CONFIG_DEFAULT.addrUSDC,
  addressUSDCx: NETWORK_CONFIG_DEFAULT.addrUSDCx,
  addressGelatoTreasury: NETWORK_CONFIG_DEFAULT.addrGelTreasury,
  addressSFCFAV1: NETWORK_CONFIG_DEFAULT.addrSFCFAV1,
  setIsOpenLeftBar: () => {},
});

export const useAppStates = (): IAppStatesContext => {
  return useContext(AppStatesContext);
};

const AppStatesProvider = ({ children }: { children: JSX.Element }) => {
  const [isIdle, setIsIdle] = useState<boolean>(false);
  useIdleTimer({
    timeout: 1_000 * 20,
    onIdle: () => {
      setIsIdle(true);
      console.log("user idle");
    },
    onActive: () => {
      setIsIdle(false);
      console.log("user active");
    },
  });
  const { address: addressWallet } = useAccount();
  const isContractInteractionAllowed = !!addressWallet; // !isIdle &&
  const [isOpenLeftBar, setIsOpenLeftBar] = useState<boolean>(false);

  const { chain: currentChain } = useNetwork();
  const currentChainId = currentChain?.id ?? polygon.id;
  const addressApp =
    NETWORK_CONFIGS[currentChainId]?.addrApp ?? NETWORK_CONFIG_DEFAULT.addrApp;
  const addressUSDC =
    NETWORK_CONFIGS[currentChainId]?.addrUSDC ??
    NETWORK_CONFIG_DEFAULT.addrUSDC;
  const addressUSDCx =
    NETWORK_CONFIGS[currentChainId]?.addrUSDCx ??
    NETWORK_CONFIG_DEFAULT.addrUSDCx;
  const addressGelatoTreasury =
    NETWORK_CONFIGS[currentChainId]?.addrGelTreasury ??
    NETWORK_CONFIG_DEFAULT.addrGelTreasury;
  const addressSFCFAV1 =
    NETWORK_CONFIGS[currentChainId]?.addrSFCFAV1 ??
    NETWORK_CONFIG_DEFAULT.addrSFCFAV1;

  //   const { isWide } = useScreenSize();
  //   useUpdateEffect(() => {
  //     if (isWide) return;
  //     setIsOpenLeftBar(false);
  //   }, [isWide]);

  const contextProvider = {
    isIdle,
    isContractInteractionAllowed,
    isOpenLeftBar,
    addressApp,
    addressUSDC,
    addressUSDCx,
    addressGelatoTreasury,
    addressSFCFAV1,
    setIsOpenLeftBar,
  };
  return (
    <AppStatesContext.Provider value={contextProvider}>
      {children}
    </AppStatesContext.Provider>
  );
};

export default AppStatesProvider;
