import prisma from "../lib/prisma.js";
import Mantle from "../mantle/mantle.js";
import shopify from "../shopify.js";

export default async function afterAuth(req, res, next) {
  const session = res.locals.shopify.session;
    if (session && session.shop && session.accessToken) {
      let existingShop = await prisma.shop.findFirst({
        where: {
          myshopifyDomain: session.shop,
        }
      });

      const SHOP_QUERY = `
        query {
          shop {
            id
            email
            name
          }
        }
      `;

      const shopifyClient = new shopify.api.clients.Graphql({ session });
      const shopifyResponse = await shopifyClient.query({
        data: {
          query: SHOP_QUERY,
        }
      });

      const email = shopifyResponse.body.data.shop.email;
      const name = shopifyResponse.body.data.shop.name;

      const mantleClient = new Mantle({
        appId: process.env.MANTLE_APP_ID,
        appApiKey: process.env.MANTLE_APP_API_KEY,
      })

      const mantleResponse = await mantleClient.identifyCustomer({
        platform: "shopify",
        accessToken: session.accessToken,
        platformId: session.shop,
        email,
        name,
      });

      if (!existingShop) {
        existingShop = await prisma.shop.create({
          data: {
            myshopifyDomain: session.shop,
            accessToken: session.accessToken,
            mantleApiToken: mantleResponse.apiToken,
            name,
            email,
          }
        })
        console.log('created new shop: ', existingShop);
      } else {
        existingShop = await prisma.shop.update({
          where: {
            id: existingShop.id,
          },
          data: {
            accessToken: session.accessToken,
            mantleApiToken: mantleResponse.apiToken,
            name,
            email,
          }
        })
        console.log('updated existing shop: ', existingShop);
      }
    }
    next();
}
