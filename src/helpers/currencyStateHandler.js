const currencies = {
  EUR: { GTQ: 8.60274, USD: 1.11792 },
  USD: { GTQ: 7.69485, EUR: 0.894515 },
  GTQ: { EUR: 0.116249, USD: 0.129957 },
};

export function getNewConversionValue(from, to) {
  return currencies[from][to];
}
