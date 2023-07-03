import { Box, IndexTable, Modal, Page, Text, VerticalStack } from "@shopify/polaris";

import { useMantle } from "../mantle/MantleProvider";
import { useAppQuery } from "../hooks";
import { money } from "../mantle/money";
import { useNavigate } from "@shopify/app-bridge-react";
import { UpgradeBanner } from "../mantle/UpgradeBanner";
import { useState } from "react";
import { UpgradeModal } from "../mantle/UpgradeModal";

export default function HomePage() {
  const navigate = useNavigate();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { currentPlan, featureLimit, hasFeature } = useMantle();

  const { data, isLoading } = useAppQuery({
    url: "/api/products",
  });

  const maxProducts = featureLimit({ feature: "product_count" });
  const products = data?.products?.slice(0, maxProducts) || [];

  return (
    <>
      <Page narrowWidth title="Your products">
        <VerticalStack gap="4">
          <UpgradeBanner
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
              loading={isLoading}
              itemCount={products.length}
              headings={[
                { title: "Thumbnail", hidden: true },
                { title: "Title" },
                { title: "Price" },
              ]}
            >
              {products.map((product) => (
                <IndexTable.Row
                  key={product.id}
                  id={product.id}
                  onClick={() => {
                    if (hasFeature({ feature: "product_detail" })) {
                      navigate(`/products/${product.id}`);
                    } else {
                      setShowUpgradeModal(true);
                    }
                  }}
                >
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
      {showUpgradeModal && (
        <UpgradeModal
          currentPlan={currentPlan}
          featureKey="product_detail"
          primaryAction={{
            content: "Select plan",
            onAction: () => {
              navigate("/plans");
            },
          }}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  );
}
