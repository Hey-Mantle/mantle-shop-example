import {
  Box,
  Button,
  HorizontalGrid,
  HorizontalStack,
  Icon,
  List,
  Page,
  Text,
  VerticalStack,
} from "@shopify/polaris";
import { useMantle } from "../mantle/MantleProvider";
import { Card } from "../components/layouts/Card";
import { money } from "../helpers/money";
import { CancelMinor, TickMinor } from "@shopify/polaris-icons";

export default function PlansPage() {
  const { plans, currentSubscription } = useMantle();

  return (
    <Page title="Plans">
      {plans.length === 0 && (
        <Card>
          <p>There are no plans available.</p>
        </Card>
      )}
      {plans.length > 0 && (
        <HorizontalGrid columns={{ sm: 1, md: plans.length }} gap="4">
          {plans.map((plan) => {
            const currentPlan = currentSubscription?.plan?.id === plan.id || plan.amount == 0 && !currentSubscription;
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
                  <Button primary disabled={currentPlan}>
                    {currentPlan ? "Current plan" : "Select plan"}
                  </Button>
                </VerticalStack>
              </Card>
            );
          })}
        </HorizontalGrid>
      )}
    </Page>
  );
}
