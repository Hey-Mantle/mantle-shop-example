import { Box, EmptyState, Page } from "@shopify/polaris";
import { notFoundImage } from "../assets";
import { Card } from "../mantle/Card";

export default function NotFound() {
  return (
    <Page>
      <Card>
        <EmptyState heading="There is no page at this address" image={notFoundImage}>
          <p>Check the URL and try again, or use the search bar to find what you need.</p>
        </EmptyState>
      </Card>
    </Page>
  );
}
