import { Box, IndexTable, Page } from "@shopify/polaris";

import { useMantle } from "../mantle/MantleProvider";
import { useAppQuery } from "../hooks";
import { money } from "../mantle/money";

export default function HomePage() {
  const mantle = useMantle();

  const { data, refetch, isLoading, isRefetching } = useAppQuery({
    url: "/api/products",
  });

  const products = data?.products || [];

  return (
    <Page narrowWidth title="Your products">
      <Box padding="0" background="bg" borderRadius="2" shadow="sm">
        <IndexTable
          resourceName={{ singular: "product", plural: "products" }}
          selectable={false}
          loading={isLoading}
          itemCount={products.length}
          headings={[{ title: "Thumbnail", hidden: true }, { title: "Title" }, { title: "Price" }]}
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
    </Page>
  );
}
