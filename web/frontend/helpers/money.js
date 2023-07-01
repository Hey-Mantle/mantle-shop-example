const largeMoneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
});

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'standard',
});

export const money = (amount) => {
  return moneyFormatter.format(amount);
}

export const moneyWithoutCents = (amount) => {
  return moneyFormatter.format(amount).replace(/\.00$/, '');
}

export const largeMoney = (amount) => {
  return largeMoneyFormatter.format(amount);
}