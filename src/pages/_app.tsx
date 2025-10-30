import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import { CssBaseline, GlobalStyles } from "@mui/material";
import AppTheme from "@/theme/AppTheme";
import { setupStore } from "@/store";
import { NotificationsProvider } from "@/hooks";
import "@/styles/globals.css";

const store = setupStore();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppTheme>
      <NotificationsProvider>
        <AppCacheProvider>
          <CssBaseline enableColorScheme />
          <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </AppCacheProvider>
      </NotificationsProvider>
    </AppTheme>
  );
}
