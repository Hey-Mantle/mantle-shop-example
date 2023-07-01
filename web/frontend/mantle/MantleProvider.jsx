import React, { createContext, useContext, useState, useEffect } from 'react';
import { Loading } from '@shopify/app-bridge-react';
import MantleClient from './MantleClient';

const MantleContext = createContext();

export const MantleProvider = ({ appId, customerApiToken, apiUrl, children }) => {
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
  }, [appId, customerApiToken, apiUrl]);

  const evaluateFeature = (feature, compare = 0) => {
    if (feature) {
      if (feature.type === 'boolean') {
        return feature.value;
      } else if (feature.type === 'limit') {
        return compare < feature.value;
      }
    }
    return false;
  };

  const plans = customer?.plans || [];
  const currentSubscription = customer?.subscription;

  const ctx = {
    currentSubscription,
    plans,
    customer,
    isLoading,
    subscribe: async (planId, returnUrl) => {
      const result = await mantleClient.subscribe({ planId, returnUrl });
      console.log(`[MantleProvider] subscribe result: `, result);
      return result;
    },
    cancelSubscription: async () => {
      const result = await mantleClient.cancelSubscription();
      console.log(`[MantleProvider] cancel subscription result: `, result);
      return result;
    },
    hasPlanFeature: (feature, compare=0) => {
      if (currentSubscription?.features[feature]) {
        return evaluateFeature(currentSubscription.features[feature], compare);
      }
      return false;
    },
    planRequired: (feature) => {
      return plans.sort((a, b) => a.amount - b.amount).find((plan) => evaluateFeature(plan.features[feature]));
    },
    refresh: async () => {
      await fetchCurrentCustomer();
    },
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <MantleContext.Provider value={ctx}>
      {children}
    </MantleContext.Provider>
  );
}

export const useMantle = () => {
  const context = useContext(MantleContext);
  
  if (context === undefined) {
    throw new Error('useMantle must be used within a MantleProvider');
  }
  
  return context;
}
