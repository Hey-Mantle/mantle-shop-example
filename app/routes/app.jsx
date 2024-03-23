import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import "@shopify/polaris/build/esm/styles.css";
import { authenticate } from "../shopify.server";
import { MantleProvider } from "@heymantle/surface";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session: _session } = await authenticate.admin(request);

  const { mantleApiToken } = await prisma.session.findUnique({
    where: { id: _session.id },
  });

  return json({
    apiKey: process.env.SHOPIFY_API_KEY || "",
    mantleAppId: process.env.MANTLE_APP_ID || "",
    mantleApiToken,
  });
};

export default function App() {
  const { apiKey, mantleAppId, mantleApiToken } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <MantleProvider
        appId={mantleAppId}
        customerApiToken={mantleApiToken}
      >
        <NavMenu>
          <Link to="/app" rel="home">
            Home
          </Link>
          <Link to="/app/additional">Additional page</Link>
          <Link to="/app/plans">Plans</Link>
        </NavMenu>
        <Outlet />
      </MantleProvider>
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
