import { Box, Button, HorizontalStack, Icon, Text, VerticalStack } from "@shopify/polaris";
import { Card } from "./Card";
import { CancelMinor, TickMinor } from "@shopify/polaris-icons";
import { useState } from "react";
import { money } from "./money";

export const PlanCard = ({ plan, currentSubscription, onSubscribe }) => {
  const [loading, setLoading] = useState(false);
  const currentPlan =
    currentSubscription?.plan?.id === plan.id || (plan.amount == 0 && !currentSubscription);

  return (
    <Card key={plan.id}>
      <VerticalStack gap="4">
        <VerticalStack gap="1">
          <Text variant="headingMd">{plan.name}</Text>
          <Text variant="headingXl">{money(plan.amount)}</Text>
        </VerticalStack>
        <VerticalStack gap="1">
          {Object.values(plan.features).map((feature) => (
            <HorizontalStack wrap={false} key={feature.id} gap="1">
              {feature.type === "boolean" && (
                <Icon
                  source={feature.value === true ? TickMinor : CancelMinor}
                  color={feature.value === true ? "success" : "critical"}
                />
              )}
              <Box width="100%">
                <Text>{feature.name}</Text>
              </Box>
            </HorizontalStack>
          ))}
        </VerticalStack>
        <Button
          primary
          loading={loading}
          disabled={currentPlan}
          onClick={async () => {
            setLoading(true);
            await onSubscribe(plan);
            setLoading(false);
          }}
        >
          {currentPlan ? "Current plan" : "Select plan"}
        </Button>
      </VerticalStack>
    </Card>
  );
};
