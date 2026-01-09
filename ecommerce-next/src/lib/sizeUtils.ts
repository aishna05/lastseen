// Size utilities for different product categories

export const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];
export const PANTS_SIZES = ["28", "30", "32", "34", "36", "38", "40", "42", "44", "46"];

/**
 * Get available sizes based on category name
 * @param categoryName - The category name (e.g., "Pant", "Kurtas", etc.)
 * @returns Array of available sizes
 */
export function getSizesForCategory(categoryName: string | null | undefined): string[] {
  if (!categoryName) return STANDARD_SIZES;
  
  const lowerName = categoryName.toLowerCase();
  
  // If it's pants, return pants sizes (28-46)
  if (lowerName.includes("pant")) {
    return PANTS_SIZES;
  }
  
  // For all other categories, use standard sizes
  return STANDARD_SIZES;
}

/**
 * Get size label for display purposes
 * @param categoryName - The category name
 * @param size - The size value
 * @returns Display label for the size
 */
export function getSizeLabel(categoryName: string | null | undefined, size: string): string {
  // For now, just return the size as-is
  // In future, this could add units like "waist: 28" or "chest: M"
  return size;
}
