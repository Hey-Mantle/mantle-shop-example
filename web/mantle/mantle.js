export default class Mantle {
  constructor({ appId, appApiKey, apiUrl = "https://api.heymantle.app/v1" }) {
    this.appId = appId;
    this.appApiKey = appApiKey;
    this.apiUrl = apiUrl;
  }

  async mantleRequest({ path, method = "GET", body }) {
    const response = await fetch(`${this.apiUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Mantle-App-Id": this.appId,
        "X-Mantle-App-Api-Key": this.appApiKey,
      },
      ...(body && {
        body: JSON.stringify(body),
      }),
    });
    const result = await response.json();
    return result;
  }

  async customerMantleRequest({ path, method = "GET", body, mantleApiToken }) {
    const response = await fetch(`${this.apiUrl}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Mantle-App-Id": this.appId,
        "X-Mantle-Customer-Api-Token": mantleApiToken,
      },
      ...(body && {
        body: JSON.stringify(body),
      }),
    });
    const result = await response.json();
    return result;
  }

  async identifyCustomer({ platform = "shopify", platformId, name, email, accessToken }) {
    console.log(`[Mantle] identifyCustomer: `, { platform, platformId, name, email, accessToken });
    const result = await this.mantleRequest({
      path: "/customers/identify",
      method: "POST",
      body: {
        platform,
        platformId,
        ...(platform === "shopify" && { myshopifyDomain: platformId }),
        name,
        email,
        accessToken,
      },
    });
    return result;
  }

  async getCustomer({ mantleApiToken }) {
    console.log(`[Mantle] getCustomer`);
    const result = await this.customerMantleRequest({ path: "/customer", mantleApiToken });
    return result.customer;
  }
}