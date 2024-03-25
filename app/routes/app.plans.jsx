import { Layout, Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useMantle, PlanCardStack, PlanCardType } from "@heymantle/surface";
import { useState } from "react";

export default function PlansPage() {
  const { customer, plans, mantleClient } = useMantle();
  const [loading, setLoading] = useState(false);

  const handleSelectPlan = async ({ plan, discount }) => {
    console.log(plan, discount);
    setLoading(true);
    console.log('mantleClient: ', mantleClient);
    const subscription = await mantleClient.subscribe({
      planId: plan.id,
      discountId: discount?.id,
      returnUrl: '/app/plans'
    });
    const url = subscription.confirmationUrl;
    console.log('url: url');
    open(url, "_top");
    setLoading(false);
  }

  return (
    <Page>
      <TitleBar title="Select a plan" />
      <Layout>
        <Layout.Section>
          <PlanCardStack
            cardType={PlanCardType.Highlighted}
            customer={customer}
            plans={plans}
            onSelectPlan={handleSelectPlan}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
