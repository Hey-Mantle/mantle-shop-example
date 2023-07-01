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
    primary: false,
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
  const { currentSubscription } = useMantle();

  return (
    <Card>
      <VerticalStack gap="4">
        <Text variant="headingMd">Current subscription</Text>
        {!currentSubscription ? (
          <HorizontalStack wrap={false} blockAlign="center">
            <Box width="80%">
              <Text>You are not currently subscribed to a plan.</Text>
            </Box>
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
          <HorizontalStack wrap={false}>
            <Box width="80%">
              <Text>
                You are currently subscribed to the {currentSubscription?.plan?.name || "free"}{" "}
                plan.
              </Text>
            </Box>
            <HorizontalGrid columns="2" gap="2" alignItems="end">
              <Button
                primary={changePlanAction.primary}
                onClick={changePlanAction.onAction}
                disabled={changePlanAction.disabled}
                loading={changePlanAction.loading}
              >
                {changePlanAction.content}
              </Button>
              <Button
                primary={cancelAction.primary}
                destructive={cancelAction.destructive}
                onClick={cancelAction.onAction}
                disabled={cancelAction.disabled}
                loading={cancelAction.loading}
                outline
              >
                {cancelAction.content}
              </Button>
            </HorizontalGrid>
          </HorizontalStack>
        )}
      </VerticalStack>
    </Card>
  );
};
