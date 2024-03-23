import { Layout, Page } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useMantle, HorizontalCards } from "@heymantle/surface";

export default function PlansPage() {
  const { customer, plans, subscribe, cancelSubscription } = useMantle();

  return (
    <Page>
      <TitleBar title="Select a plan" />
      <Layout>
        <Layout.Section>
          <HorizontalCards
            customer={customer}
            plans={plans}
            onSubscribe={async ({ planId, discountId }) => {
              const returnUrl = '/app/plans';
              const subscription = await subscribe({ planId, discountId, returnUrl });
              const url = subscription.confirmationUrl;
              open(url, "_top");
            }}
          />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
