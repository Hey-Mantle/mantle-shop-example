import { Layout, Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useMantle, HorizontalPlanCards } from "@heymantle/surface";

export default function PlansPage() {
  const { customer, plans, mantleClient } = useMantle();

  return (
    <Page>
      <TitleBar title="Select a plan" />
      <Layout>
        <Layout.Section>
          <HorizontalPlanCards
            customer={customer}
            plans={plans}
            onSubscribe={async (plan) => {
              const returnUrl = '/app/plans';
              const subscription = await mantleClient.subscribe({ planId: plan.id, returnUrl });
              const url = subscription.confirmationUrl;
              open(url, "_top");
            }}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
