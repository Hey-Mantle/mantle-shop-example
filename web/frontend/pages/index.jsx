import { Banner, Box, IndexTable, Page, Text, VerticalStack } from "@shopify/polaris";

import { useMantle } from "../mantle/MantleProvider";
import { useAppQuery } from "../hooks";
import { money } from "../mantle/money";
import { useNavigate } from "@shopify/app-bridge-react";
import { PlanUpgradeBanner } from "../mantle/PlanUpgradeBanner";

export default function HomePage() {
  const navigate = useNavigate();
  const { currentPlan, featureLimit } = useMantle();

  const { data, isLoading } = useAppQuery({
    url: "/api/products",
  });

  const maxProducts = featureLimit({ feature: "product_count" });
  const products = data?.products?.slice(0, maxProducts) || [];

  return (
    <Page narrowWidth title="Your products">
      <VerticalStack gap="4">
        <PlanUpgradeBanner
          currentPlan={currentPlan}
          featureKey="product_count"
          count={data?.products?.length}
          action={{
            content: "Upgrade plan",
            onAction: () => {
              navigate("/plans");
            },
          }}
        />
        <Box padding="0" background="bg" borderRadius="2" shadow="sm">
          <IndexTable
            resourceName={{ singular: "product", plural: "products" }}
            selectable={false}
            loading={isLoading}
            itemCount={products.length}
            headings={[
              { title: "Thumbnail", hidden: true },
              { title: "Title" },
              { title: "Price" },
            ]}
          >
            {products.map((product) => (
              <IndexTable.Row key={product.id} id={product.id} selected={false}>
                <IndexTable.Cell>
                  {product.image?.src && (
                    <img src={product.image?.src} alt={product.title} width="50" height="50" />
                  )}
                </IndexTable.Cell>
                <IndexTable.Cell>{product.title}</IndexTable.Cell>
                <IndexTable.Cell>{money({ amount: product.variants[0].price })}</IndexTable.Cell>
              </IndexTable.Row>
            ))}
          </IndexTable>
        </Box>
      </VerticalStack>
    </Page>
  );
}
