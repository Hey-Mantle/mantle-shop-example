import {
  Page,
} from "@shopify/polaris";
import { SubscriptionCard } from "../mantle/SubscriptionCard";
import { useNavigate } from "@shopify/app-bridge-react";

export default function SettingsPage() {
  const navigate = useNavigate();
  return (
    <Page title="Settings" narrowWidth>
      <SubscriptionCard 
        subscribeAction={{
          content: "Select plan",
          primary: true,
          onAction: () => {
            navigate("/plans")
          },
        }}
      />
    </Page>
  );
}
