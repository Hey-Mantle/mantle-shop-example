import {
  Box,
  Button,
  HorizontalGrid,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@shopify/polaris";
import { Card } from "./Card";
import { useMantle } from "./MantleProvider";
import { money } from "./money";

const intervalString = (interval) => {
  switch (interval) {
    case "EVERY_30_DAYS":
      return "every 30 days";
    default:
      return "every year";
  }
};

export const SubscriptionCard = ({
  subscribeAction = {
    content: "Select plan",
    primary: true,
    onAction: () => {},
    loading: false,
    disabled: false,
  },
  changePlanAction = {
    content: "Change plan",
    primary: true,
    onAction: () => {},
    loading: false,
    disabled: false,
  },
  cancelAction = {
    content: "Cancel subscription",
    primary: false,
    onAction: () => {},
    destructive: true,
    loading: false,
    disabled: false,
  },
}) => {
  const { subscription } = useMantle();

  return (
    <Card>
      <VerticalStack gap="4">
        <Text variant="headingMd">Current subscription</Text>
        
        {!subscription ? (
          <HorizontalStack wrap={false} blockAlign="center" align="space-between">
            <Text>You are not currently subscribed to a plan.</Text>
            <Button
              primary={subscribeAction.primary}
              onClick={subscribeAction.onAction}
              disabled={subscribeAction.disabled}
              loading={subscribeAction.loading}
            >
              {subscribeAction.content}
            </Button>
          </HorizontalStack>
        ) : (
          <VerticalStack gap="4">
            <Text>
              You are currently subscribed to the {subscription.plan.name || "free"} plan for{" "}
              {money({
                amount: subscription.plan.amount,
                currency: subscription.plan.currencyCode,
              })}{" "}
              {intervalString(subscription.plan.interval)}.
            </Text>

            <HorizontalStack align="end" gap="2">
              <Button
                primary={cancelAction.primary}
                destructive={cancelAction.destructive}
                onClick={cancelAction.onAction}
                disabled={cancelAction.disabled}
                loading={cancelAction.loading}
              >
                {cancelAction.content}
              </Button>
              <Button
                primary={changePlanAction.primary}
                onClick={changePlanAction.onAction}
                disabled={changePlanAction.disabled}
                loading={changePlanAction.loading}
              >
                {changePlanAction.content}
              </Button>
            </HorizontalStack>
          </VerticalStack>
        )}
      </VerticalStack>
    </Card>
  );
};
