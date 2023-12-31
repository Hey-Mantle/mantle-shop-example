import { Box, HorizontalGrid, Page } from "@shopify/polaris";
import { useMantle } from "../mantle/MantleProvider";
import { PlanCard } from "../mantle/PlanCard";
import { useContext } from "react";
import { Context, useNavigate } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";

const remoteRedirect = (url, app) => {
  const redirect = Redirect.create(app);
  return redirect.dispatch(Redirect.Action.REMOTE, url);
};

export default function PlansPage() {
  const app = useContext(Context);
  const navigate = useNavigate();
  const { plans, currentPlan, subscribe, refetch } = useMantle();
  const hasUsageCharges = plans.some((plan) => Object.keys(plan.usageCharges).length > 0);

  return (
    <Page title="Plans" backAction={{
      content: "Back",
      onAction: () => {
        navigate("/settings");
      }
    }}>
      {plans.length === 0 && (
        <Box padding="5" background="bg" borderRadius="2" shadow="sm">
          <p>There are no plans available.</p>
        </Box>
      )}
      {plans.length > 0 && (
        <HorizontalGrid columns={{ sm: 1, md: plans.length }} gap="4">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              hasUsageCharges={hasUsageCharges}
              plan={plan}
              currentPlan={currentPlan}
              onSubscribe={async (_plan) => {
                const subscription = await subscribe({ planId: _plan.id, returnUrl: "/settings" });
                if (subscription.confirmationUrl) {
                  remoteRedirect(subscription.confirmationUrl, app);
                } else {
                  await refetch();
                }
              }}
            />
          ))}
        </HorizontalGrid>
      )}
    </Page>
  );
}
