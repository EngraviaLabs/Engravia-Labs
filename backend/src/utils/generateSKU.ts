export const generateSKU = async (categoryName: string): Promise<string> => {
  const prefix = categoryName.substring(0, 3).toUpperCase().replace(/\s/g, '');
  const random = Math.floor(10000 + Math.random() * 90000);
  return `EL-${prefix}-${random}`;
};
