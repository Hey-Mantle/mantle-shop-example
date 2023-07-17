import { v4 as uuidv4 } from "uuid";
class MantleClient {
  constructor({ appId, customerApiToken, apiUrl = "https://api.heymantle.app/v1" }) {
    this.appId = appId;
    this.customerApiToken = customerApiToken;
    this.apiUrl = apiUrl;
  }

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
    return (await this.mantleRequest({ path: "/customer" })).customer;
  }

  async subscribe({ planId, returnUrl }) {
    return await this.mantleRequest({
      path: "/subscriptions",
      method: "POST",
      body: { planId, returnUrl },
    });
  }

  async sendUsageEvent({ eventId = uuidv4(), eventType, value = 1, data = {} }) {
    return await this.mantleRequest({
      path: "/usage_events",
      method: "POST",
      body: { eventId, eventType, value, data },
    });
  }

  async cancelSubscription() {
    return await this.mantleRequest({ path: "/subscriptions", method: "DELETE" });
  }
}

export default MantleClient;
