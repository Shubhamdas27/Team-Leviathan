import { ItemCategory, ItemSize, ItemCondition, SortOption } from "../types";

// Item categories
export const ITEM_CATEGORIES: { value: ItemCategory; label: string }[] = [
  { value: "dresses", label: "Dresses" },
  { value: "tops", label: "Tops" },
  { value: "bottoms", label: "Bottoms" },
  { value: "accessories", label: "Accessories" },
  { value: "shoes", label: "Shoes" },
  { value: "outerwear", label: "Outerwear" },
];

// Item sizes
export const ITEM_SIZES: { value: ItemSize; label: string }[] = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
];

// Item conditions
export const ITEM_CONDITIONS: {
  value: ItemCondition;
  label: string;
  description: string;
}[] = [
  { value: "new", label: "New", description: "Brand new with tags" },
  {
    value: "like-new",
    label: "Like New",
    description: "Excellent condition, barely worn",
  },
  { value: "good", label: "Good", description: "Minor signs of wear" },
  {
    value: "fair",
    label: "Fair",
    description: "Noticeable wear but still functional",
  },
];

// Sort options
export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "points-low", label: "Points: Low to High" },
  { value: "points-high", label: "Points: High to Low" },
];

// Popular colors
export const COLORS = [
  "Black",
  "White",
  "Gray",
  "Navy",
  "Blue",
  "Red",
  "Pink",
  "Purple",
  "Green",
  "Yellow",
  "Orange",
  "Brown",
  "Beige",
  "Gold",
  "Silver",
];

// Popular brands
export const BRANDS = [
  "Nike",
  "Adidas",
  "Zara",
  "H&M",
  "Uniqlo",
  "Gap",
  "Levi's",
  "Forever 21",
  "Urban Outfitters",
  "American Eagle",
  "Hollister",
  "Abercrombie & Fitch",
  "Target",
  "Old Navy",
  "Banana Republic",
  "J.Crew",
  "Mango",
  "Topshop",
];

// Utility functions
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatPoints = (points: number): string => {
  return points.toLocaleString() + " points";
};

export const getConditionColor = (condition: ItemCondition): string => {
  switch (condition) {
    case "new":
      return "bg-green-100 text-green-800";
    case "like-new":
      return "bg-blue-100 text-blue-800";
    case "good":
      return "bg-yellow-100 text-yellow-800";
    case "fair":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "available":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "swapped":
      return "bg-blue-100 text-blue-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    case "accepted":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s|-|\(|\)/g, ""));
};

export const getFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

export const capitalizeFirst = (str: string): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const calculatePointValue = (
  condition: ItemCondition,
  brand?: string
): number => {
  let baseValue = 10;

  // Adjust based on condition
  switch (condition) {
    case "new":
      baseValue *= 2;
      break;
    case "like-new":
      baseValue *= 1.5;
      break;
    case "good":
      baseValue *= 1.2;
      break;
    case "fair":
      baseValue *= 1;
      break;
  }

  // Adjust based on brand (if premium brand)
  const premiumBrands = ["nike", "adidas", "gucci", "prada", "levi", "zara"];
  if (brand && premiumBrands.includes(brand.toLowerCase())) {
    baseValue *= 1.3;
  }

  return Math.round(baseValue);
};

// Storage helpers
export const storage = {
  get: (key: string): any => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  },

  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  clear: (): void => {
    localStorage.clear();
  },
};

// Error helpers
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};

export const getValidationErrors = (error: any): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (error.response?.data?.errors) {
    error.response.data.errors.forEach((err: any) => {
      Object.assign(errors, err);
    });
  }

  return errors;
};
