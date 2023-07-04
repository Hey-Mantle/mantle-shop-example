import { Box, Button, Text, VerticalStack } from "@shopify/polaris";
import { useState } from "react";
import { money } from "./utils";
import { PlanFeatureListItem } from "./PlanFeatureListItem";
import { featureSort } from "./utils";

export const PlanCard = ({ plan, currentPlan, onSubscribe }) => {
  const [loading, setLoading] = useState(false);
  const isCurrentPlan = currentPlan.id === plan.id;

  return (
    <Box padding="5" background="bg" borderRadius="2" shadow="sm">
      <VerticalStack gap="4">
        <VerticalStack gap="1">
          <Text variant="headingMd">{plan.name}</Text>
          <Text variant="headingXl">
            {money({ amount: plan.amount, currency: plan.currencyCode })}
          </Text>
        </VerticalStack>
        <VerticalStack gap="1">
          {Object.values(plan.features)
            .sort(featureSort)
            .map((feature) => (
              <PlanFeatureListItem key={feature.id} feature={feature} />
            ))}
        </VerticalStack>
        <Button
          primary
          loading={loading}
          disabled={isCurrentPlan}
          onClick={async () => {
            setLoading(true);
            await onSubscribe(plan);
            setLoading(false);
          }}
        >
          {isCurrentPlan ? "Current plan" : "Select plan"}
        </Button>
      </VerticalStack>
    </Box>
  );
};
