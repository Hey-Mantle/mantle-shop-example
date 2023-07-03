import React, { createContext, useContext, useState, useEffect } from "react";
import { Loading } from "@shopify/app-bridge-react";
import MantleClient from "./MantleClient";

const MantleContext = createContext();

export const MantleProvider = ({
  appId,
  customerApiToken,
  apiUrl = "https://api.heymantle.app/v1",
  embedded = true,
  children,
}) => {
  const mantleClient = new MantleClient({ appId, customerApiToken, apiUrl });

  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentCustomer = async () => {
    try {
      setIsLoading(true);
      const customer = await mantleClient.getCustomer();
      setCustomer(customer);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentCustomer();
  }, []);

  const evaluateFeature = (feature, compare = 0) => {
    if (feature) {
      if (feature.type === "boolean") {
        return feature.value;
      } else if (feature.type === "limit") {
        return compare < feature.value || feature.value === -1;
      }
    }
    return false;
  };

  const plans = customer?.plans || [];
  const subscription = customer?.subscription;
  const currentPlan = subscription?.plan || plans.find((plan) => plan.amount === 0 && plan.public);

  const ctx = {
    customer,
    subscription,
    currentPlan,
    plans,
    isLoading,
    subscribe: async ({ planId, returnUrl }) => {
      const result = await mantleClient.subscribe({ planId, returnUrl });
      console.log(`[MantleProvider] subscribe result: `, result);
      return result;
    },
    cancelSubscription: async () => {
      const result = await mantleClient.cancelSubscription();
      console.log(`[MantleProvider] cancel subscription result: `, result);
      return result;
    },
    hasFeature: ({ feature, compare = 0 }) => {
      if (currentPlan?.features[feature]) {
        return evaluateFeature(currentPlan.features[feature], compare);
      }
      return false;
    },
    requiredPlan: ({ feature }) => {
      return plans
        .sort((a, b) => a.amount - b.amount)
        .find((plan) => evaluateFeature(plan.features[feature]));
    },
    refetch: async () => {
      await fetchCurrentCustomer();
    },
  };

  if (isLoading && embedded) {
    return <Loading />;
  }

  return <MantleContext.Provider value={ctx}>{children}</MantleContext.Provider>;
};

export const useMantle = () => {
  const context = useContext(MantleContext);

  if (context === undefined) {
    throw new Error("useMantle must be used within a MantleProvider");
  }

  return {
    subscription: context.subscription,
    currentPlan: context.currentPlan,
    plans: context.plans,
    customer: context.customer,
    isLoading: context.isLoading,
    subscribe: context.subscribe,
    cancelSubscription: context.cancelSubscription,
    hasFeature: context.hasFeature,
    requiredPlan: context.requiredPlan,
    refetch: context.refetch,
  };
};
