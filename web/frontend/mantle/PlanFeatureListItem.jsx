import { Box, HorizontalStack, Icon, Text } from "@shopify/polaris";
import { CircleCancelMinor, CircleTickMinor } from "@shopify/polaris-icons";

export const PlanFeatureListItem = ({ feature }) => {
  const enabled = (feature.type === "boolean" && feature.value == true) || feature.type === "limit";
  return (
    <HorizontalStack gap="2" align="start" wrap={false}>
      <Icon
        source={enabled ? CircleTickMinor : CircleCancelMinor}
        color={enabled ? "success" : "subdued"}
      />
      <Box width="100%">
        <Text>
          {feature.name}
          {feature.type === "limit"
            ? `: ${feature.value > 0 ? "unlimited" : `up to ${feature.value}`}`
            : ""}
        </Text>
      </Box>
    </HorizontalStack>
  );
};
