import { HorizontalGrid, Page } from "@shopify/polaris";
import { useMantle } from "../mantle/MantleProvider";
import { Card } from "../mantle/Card";
import { PlanCard } from "../mantle/PlanCard";

export default function PlansPage() {
  const { plans, currentSubscription, subscribe } = useMantle();

  return (
    <Page title="Plans">
      {plans.length === 0 && (
        <Card>
          <p>There are no plans available.</p>
        </Card>
      )}
      {plans.length > 0 && (
        <HorizontalGrid columns={{ sm: 1, md: plans.length }} gap="4">
          {plans.map((plan) => (
            <PlanCard
              plan={plan}
              currentSubscription={currentSubscription}
              onSubscribe={async (_plan) => {
                await subscribe(_plan.id);
              }}
            />
          ))}
        </HorizontalGrid>
      )}
    </Page>
  );
}
