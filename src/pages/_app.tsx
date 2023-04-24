import "~/styles/globals.css";

import { type AppType } from "next/app";
import { type Session } from "next-auth";

import { api } from "~/utils/api";

import ThemeProvider from "~/contexts/Theme";
import WalletProvider from "~/contexts/Wallet";
import AppStatesProvider from "~/contexts/AppStates";
import Hydration from "~/contexts/Hydration";
import MainLayout from "~/component/layouts/MainLayout";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <ThemeProvider>
      <Hydration>
        <WalletProvider session={session}>
          <AppStatesProvider>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </AppStatesProvider>
        </WalletProvider>
      </Hydration>
    </ThemeProvider>
  );
};

export default api.withTRPC(App);
