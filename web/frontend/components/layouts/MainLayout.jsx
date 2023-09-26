import { Loading } from "@shopify/app-bridge-react";
import { useAppQuery } from "../../hooks";
import { MantleProvider } from "../../mantle/MantleProvider";

const YOUR_APP_ID = "beeecdf3-8e94-442c-b29c-0637511b7cc8";

export const MainLayout = ({ children }) => {
  const { data: shop, isLoading } = useAppQuery({
    url: "/api/shop",
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MantleProvider
      apiUrl="https://appapi.heymantle.com/v1"
      appId={YOUR_APP_ID}
      customerApiToken={shop.mantleApiToken}
    >
      {children}
    </MantleProvider>
  );
};
