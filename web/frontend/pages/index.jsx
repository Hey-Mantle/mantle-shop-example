import {
  Page,
} from "@shopify/polaris";
import { useTranslation } from "react-i18next";

import { useMantle } from "../mantle/MantleProvider";

export default function HomePage() {
  const mantle = useMantle();

  const { t } = useTranslation();

  return (
    <Page narrowWidth title="Products by Mantle">
      
    </Page>
  );
}
