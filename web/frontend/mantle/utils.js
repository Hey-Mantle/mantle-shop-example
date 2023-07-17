export const featureEnabled = (feature) => {
  return (
    (feature.type === "boolean" && feature.value == true) ||
    (feature.type === "limit" && feature.value !== 0)
  );
};

export const featureSort = (a, b) =>
  featureEnabled(b) - featureEnabled(a) || a.name.localeCompare(b.name);

const largeMoneyFormatter = (currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
  });

const moneyFormatter = (currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "standard",
  });

export const money = ({ amount = 0, currency = "USD" }) => {
  return moneyFormatter(currency).format(amount);
};

export const moneyWithoutCents = ({ amount = 0, currency = "USD" }) => {
  return moneyFormatter(currency).format(amount).replace(/\.00$/, "");
};

export const largeMoney = ({ amount = 0, currency = "USD" }) => {
  return largeMoneyFormatter(currency).format(amount);
};

export const intervalLabel = (interval) => {
  switch (interval) {
    case "ANNUAL":
      return "yearly";
    case "EVERY_30_DAYS":
    default:
      return "monthly";
  }
};

export const intervalLabelShort = (interval) => {
  switch (interval) {
    case "ANNUAL":
      return "yr";
    case "EVERY_30_DAYS":
    default:
      return "mo";
  }
};
