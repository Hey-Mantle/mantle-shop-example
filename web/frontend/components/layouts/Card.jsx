import { Box } from "@shopify/polaris";

export const Card = ({ children }) => (
  <Box padding="5" background="bg" borderRadius="2" shadow="sm">
    {children}
  </Box>
);
