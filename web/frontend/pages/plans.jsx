import { HorizontalGrid, Page } from "@shopify/polaris";
import { useMantle } from "../mantle/MantleProvider";
import { Card } from "../mantle/Card";
import { PlanCard } from "../mantle/PlanCard";
import { useContext } from "react";
import { Context } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";

const remoteRedirect = (url, app) => {
  const redirect = Redirect.create(app);
  return redirect.dispatch(Redirect.Action.REMOTE, url);
};

export default function PlansPage() {
  const app = useContext(Context);
  const { plans, currentSubscription, subscribe, refresh } = useMantle();

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
                const subscription = await subscribe(_plan.id, "/settings");
                if (subscription.confirmationUrl) {
                  remoteRedirect(subscription.confirmationUrl, app);
                } else {
                  await refresh();
                }
              }}
            />
          ))}
        </HorizontalGrid>
      )}
    </Page>
  );
}
