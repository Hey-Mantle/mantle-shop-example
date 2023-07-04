import {
  Box,
  Button,
  DropZone,
  HorizontalStack,
  Image,
  IndexTable,
  Layout,
  Link,
  Modal,
  Page,
  Select,
  Text,
  TextField,
  VerticalStack,
} from "@shopify/polaris";

import { useMantle } from "../../mantle/MantleProvider";
import { useAppQuery } from "../../hooks";
import { Loading, useNavigate } from "@shopify/app-bridge-react";
import { useParams } from "react-router-dom";
import { UpgradeBanner } from "../../mantle/UpgradeBanner";

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { currentPlan, hasFeature } = useMantle();

  const { data, isLoading } = useAppQuery({
    url: `/api/products/${id}`,
  });

  if (isLoading) {
    return <Loading />;
  }

  const product = data?.product;
  const disabled = !hasFeature({ feature: "product_edit" });

  return (
    <Page
      title={product.title}
      backAction={{
        content: "Back",
        onAction: () => {
          window.history.back();
        },
      }}
    >
      <Layout>
        <Layout.Section>
          <VerticalStack gap="4">
            <UpgradeBanner
              currentPlan={currentPlan}
              featureKey="product_edit"
              action={{
                content: "Upgrade plan",
                onAction: () => {
                  navigate("/plans");
                },
              }}
            />
            <Box padding="5" background="bg" borderRadius="2" shadow="sm">
              <VerticalStack gap="4">
                <TextField label="Title" value={product.title} disabled={disabled} />
                <TextField
                  label="Description"
                  value={product.bodyHtml}
                  multiline={5}
                  disabled={disabled}
                />
              </VerticalStack>
            </Box>
            <Box padding="5" background="bg" borderRadius="2" shadow="sm">
              <VerticalStack gap="4">
                <Text variant="headingMd">Media</Text>
                <HorizontalStack gap="4">
                  <Box
                    background="bg"
                    borderRadius="2"
                    borderColor="border"
                    borderWidth="1"
                    overflowX="hidden"
                  >
                    <Image source={product.images[0].src} alt={product.title} width="300" />
                  </Box>
                  <DropZone disabled={disabled}>
                    <Box padding="5">
                      <VerticalStack gap="4" align="center" inlineAlign="center">
                        <Box background="bg-interactive-subdued" padding="1" borderRadius="1">
                          <Link removeUnderline>
                            <Text variant="bodySm" fontWeight="bold">
                              Add
                            </Text>
                          </Link>
                        </Box>
                        <Link>
                          <Text variant="bodySm" fontWeight="bold">
                            Add from URL
                          </Text>
                        </Link>
                      </VerticalStack>
                    </Box>
                  </DropZone>
                </HorizontalStack>
              </VerticalStack>
            </Box>
          </VerticalStack>
        </Layout.Section>
        <Layout.Section secondary>
          <Box padding="5" background="bg" borderRadius="2" shadow="sm">
            <VerticalStack gap="4">
              <Text variant="headingMd">Status</Text>
              <Select
                disabled={disabled}
                label="Status"
                labelHidden
                options={["Active", "Draft"]}
                value={product.status}
              />
            </VerticalStack>
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
