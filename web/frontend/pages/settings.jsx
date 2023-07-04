import { Modal, Page, Text } from "@shopify/polaris";
import { SubscriptionCard } from "../mantle/SubscriptionCard";
import { useNavigate } from "@shopify/app-bridge-react";
import { useMantle } from "../mantle/MantleProvider";
import { useState } from "react";

export default function SettingsPage() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const { cancelSubscription, refetch, isLoading, subscription } = useMantle();
  const navigate = useNavigate();

  return (
    <>
      <Page title="Settings" narrowWidth>
        <SubscriptionCard
          subscription={subscription}
          subscribeAction={{
            content: "Select plan",
            primary: true,
            onAction: () => {
              navigate("/plans");
            },
          }}
          cancelAction={{
            content: "Cancel subscription",
            primary: false,
            onAction: () => {
              setShowCancelModal(true);
            },
            destructive: true,
          }}
          changePlanAction={{
            content: "Change plan",
            primary: true,
            onAction: () => {
              navigate("/plans");
            },
          }}
        />
      </Page>
      {showCancelModal && (
        <Modal
          title="Cancel subscription?"
          open
          onClose={() => setShowCancelModal(false)}
          sectioned
          primaryAction={{
            content: "Cancel subscription",
            destructive: true,
            loading: isCancelling || isLoading,
            onAction: async () => {
              setIsCancelling(true);
              await cancelSubscription();
              await refetch();
              setIsCancelling(false);
              setShowCancelModal(false);
            },
          }}
          secondaryActions={[
            {
              content: "Keep subscription",
              onAction: () => setShowCancelModal(false),
              disabled: isCancelling || isLoading,
            },
          ]}
        >
          <Text>You will be able to subscribe again if you change your mind.</Text>
        </Modal>
      )}
    </>
  );
}
