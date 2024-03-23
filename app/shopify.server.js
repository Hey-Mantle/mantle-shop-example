import "@shopify/shopify-app-remix/adapters/node";
import {
  AppDistribution,
  DeliveryMethod,
  shopifyApp,
  LATEST_API_VERSION,
  LogSeverity,
} from "@shopify/shopify-app-remix/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import { restResources } from "@shopify/shopify-api/rest/admin/2024-01";
import prisma from "./db.server";
import { MantleClient } from "@heymantle/client";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: LATEST_API_VERSION,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  restResources,
  // logger: {
  //   level: LogSeverity.Debug,
  //   httpRequests: true,
  // },
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: "/webhooks",
    },
  },
  hooks: {
    afterAuth: async ({ admin, session }) => {
      shopify.registerWebhooks({ session });

      const response = await admin.graphql(
        `#graphql
          query getShop {
            shop {
              id
            }
          }`,
      );
      const responseJson = await response.json();
      const shop = responseJson.data?.shop;
      const mantleClient = new MantleClient({
        appId: process.env.MANTLE_APP_ID,
        apiKey: process.env.MANTLE_APP_API_KEY,
      });
      const identifyResponse = await mantleClient.identify({
        platform: "shopify",
        platformId: shop.id,
        myshopifyDomain: session.shop,
        accessToken: session.accessToken,
      });
      const mantleApiToken = identifyResponse?.apiToken;
      await prisma.session.update({
        where: { id: session.id },
        data: { mantleApiToken },
      });
    },
  },
  future: {
    v3_webhookAdminContext: true,
    v3_authenticatePublic: true,
    unstable_newEmbeddedAuthStrategy: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = LATEST_API_VERSION;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
