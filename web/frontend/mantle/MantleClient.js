class MantleClient {
  constructor({ appId, customerApiToken, apiUrl = "https://api.heymantle.app/v1" }) {
    this.appId = appId;
    this.customerApiToken = customerApiToken;
    this.apiUrl = apiUrl;
  }

  // TODO: Use mantle.js instead of rewriting this for the frontend components
  async mantleRequest({ path, method = "GET", body }) {
    const response = await fetch(`${this.apiUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Mantle-App-Id": this.appId,
        "X-Mantle-Customer-Api-Token": this.customerApiToken,
      },
      ...(body && {
        body: JSON.stringify(body),
      }),
    });
    const result = await response.json();
    return result;
  }

  async getCustomer() {
    console.log(`[MantleApiClient] getCustomer`);
    const result = await this.mantleRequest({ path: "/customer" });
    return result.customer;
  }

  async subscribe({ planId, returnUrl }) {
    console.log(`[MantleApiClient] subscribe: `, { planId, returnUrl });
    const result = await this.mantleRequest({
      path: "/subscriptions",
      method: "POST",
      body: { planId, returnUrl },
    });
    return result;
  }

  async cancelSubscription() {
    console.log(`[MantleApiClient] cancel subscription`);
    const result = await this.mantleRequest({ path: "/subscriptions", method: "DELETE" });
    return result;
  }
}

export default MantleClient;
