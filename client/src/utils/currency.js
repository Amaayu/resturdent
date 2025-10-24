/**
 * Format price in Indian Rupees
 * @param {number} amount - The amount to format
 * @returns {string} Formatted price with ₹ symbol
 */
export const formatPrice = (amount) => {
  return `₹${amount.toFixed(2)}`;
};

/**
 * Format price in Indian number system (with commas)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted price with ₹ symbol and Indian comma format
 */
export const formatPriceIndian = (amount) => {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
