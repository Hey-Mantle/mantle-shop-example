import { Banner } from "@shopify/polaris";

export const PlanUpgradeBanner = ({
  currentPlan,
  featureKey,
  count,
  action = {
    content: "Upgrade plan",
    onAction: () => {},
  },
}) => {
  const planFeature = currentPlan?.features?.[featureKey];
  const upgradeRequired =
    (planFeature?.type === "limit" && planFeature?.value >= 0 && count > planFeature?.value) ||
    (planFeature?.type === "boolean" && planFeature?.value === false);

  if (!upgradeRequired) {
    return null;
  }

  return (
    <Banner title="Upgrade required" status="warning" action={action}>
      You have reached the limit of {planFeature?.value} for your current plan. Please upgrade to
      continue.
    </Banner>
  );
};
