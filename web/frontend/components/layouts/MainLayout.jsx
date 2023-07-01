import { Loading } from "@shopify/app-bridge-react";
import { useAppQuery } from "../../hooks";
import { MantleProvider } from "../../mantle/MantleProvider";

export const MainLayout = ({ children }) => {
  const { data: shop, isLoading } = useAppQuery({
    url: "/api/shop",
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MantleProvider
      apiUrl="https://api.heymantle.app/v1"
      appId="394ea8ff-ed72-4841-8218-335c560be51c"
      customerApiToken={shop.mantleApiToken}
    >
      {children}
    </MantleProvider>
  );
};
