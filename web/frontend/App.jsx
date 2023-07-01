import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";

import { AppBridgeProvider, QueryProvider, PolarisProvider } from "./components";
import { MainLayout } from "./components/layouts/MainLayout";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager("./pages/**/!(*.test.[jt]sx)*.([jt]sx)");
  const { t } = useTranslation();

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <MainLayout>
              <NavigationMenu
                navigationLinks={[
                  {
                    label: "Products",
                    destination: "/",
                  },
                  {
                    label: "Settings",
                    destination: "/settings",
                  }
                ]}
              />
              <Routes pages={pages} />
            </MainLayout>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}
