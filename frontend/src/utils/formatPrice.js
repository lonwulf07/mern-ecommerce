export const formatPrice = (num) => {
  // Intl.NumberFormat('en-IN') applies the Indian comma system
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(Math.round(num));
};