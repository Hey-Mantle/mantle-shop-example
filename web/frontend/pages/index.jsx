import { Banner, Box, IndexTable, Page, Text, VerticalStack } from "@shopify/polaris";

import { useMantle } from "../mantle/MantleProvider";
import { useAppQuery } from "../hooks";
import { money } from "../mantle/money";
import { useNavigate } from "@shopify/app-bridge-react";

export default function HomePage() {
  const navigate = useNavigate();
  const { currentPlan, hasFeature } = useMantle();

  const { data, isLoading } = useAppQuery({
    url: "/api/products",
  });

  const limitProducts = !isLoading && !hasFeature({ feature: "product_count", compare: data?.products.length });
  const products = data?.products?.slice(0, currentPlan?.features?.product_count?.value) || [];

  return (
    <Page narrowWidth title="Your products">
      <VerticalStack gap="4">
        {limitProducts && (
          <Banner status="warning" title="Upgrade required" action={{
            content: "Upgrade plan",
            onAction: () => {
              navigate("/plans");
            }
          }}>
            <Text>
              You have reached the limit of {currentPlan?.features?.product_count?.value} products for
              your current plan. Please upgrade your plan to continue.
            </Text>
          </Banner>
        )}
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
            {products.map(product => (
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
