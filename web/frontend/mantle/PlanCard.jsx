import {
  Badge,
  Box,
  Button,
  Divider,
  HorizontalStack,
  Text,
  VerticalStack,
} from "@shopify/polaris";
import { useState } from "react";
import { money } from "./utils";
import { PlanFeatureListItem } from "./PlanFeatureListItem";
import { featureSort } from "./utils";

export const PlanCard = ({ plan, currentPlan, hasUsageCharges = false, onSubscribe }) => {
  const [loading, setLoading] = useState(false);
  const isCurrentPlan = currentPlan.id === plan.id;

  return (
    <Box padding="5" background="bg" borderRadius="2" shadow="sm">
      <VerticalStack gap="4">
        <VerticalStack gap="2">
          <VerticalStack gap="1">
            <HorizontalStack align="space-between" blockAlign="center">
              <Text variant="headingMd" color="subdued">
                {plan.name}
              </Text>
              {plan.trialDays > 0 && (
                <Badge status="success">{plan.trialDays} day free trial!</Badge>
              )}
            </HorizontalStack>
            <Text variant="headingXl">
              {money({ amount: plan.amount, currency: plan.currencyCode })}
            </Text>
          </VerticalStack>
          {hasUsageCharges && (
            Object.keys(plan.usageCharges).length > 0 ? (
              <Text variant="bodySm" color="subdued">
                {Object.values(plan.usageCharges)
                  .map((charge) => charge.shortDescription)
                  .join(", ")}
              </Text>
            ) : (
              <Text variant="bodySm" color="subdued">
                &mdash;
              </Text>
            )
          )}
        </VerticalStack>
        <Divider />
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
