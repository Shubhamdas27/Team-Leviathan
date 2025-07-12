export interface User {
  id: string;
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  points: number;
  role: "user" | "admin";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: string;
  _id: string;
  title: string;
  description: string;
  category:
    | "dresses"
    | "tops"
    | "bottoms"
    | "accessories"
    | "shoes"
    | "outerwear";
  type: string;
  size: "XS" | "S" | "M" | "L" | "XL" | "XXL";
  condition: "new" | "like-new" | "good" | "fair";
  color: string;
  brand?: string;
  images: string[];
  tags: string[];
  pointValue: number;
  owner: {
    id: string;
    fullName: string;
    avatar?: string;
    points?: number;
    address?: {
      city: string;
      state: string;
    };
  };
  status: "available" | "pending" | "swapped" | "rejected";
  isApproved: boolean;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Swap {
  id: string;
  requester: {
    id: string;
    fullName: string;
    avatar?: string;
    email?: string;
    points?: number;
  };
  owner: {
    id: string;
    fullName: string;
    avatar?: string;
    email?: string;
  };
  requestedItem: {
    id: string;
    title: string;
    images: string[];
    pointValue: number;
  };
  offeredItem?: {
    id: string;
    title: string;
    images: string[];
    pointValue: number;
  };
  pointsOffered?: number;
  status: "pending" | "accepted" | "rejected" | "completed";
  message?: string;
  rejectionReason?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{ [key: string]: string }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items?: T[];
    users?: T[];
    swaps?: T[];
    pagination: {
      current: number;
      pages: number;
      total: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface ItemFilters {
  category?: string;
  size?: string;
  condition?: string;
  color?: string;
  brand?: string;
  search?: string;
  sortBy?: "newest" | "oldest" | "points-low" | "points-high";
  page?: number;
  limit?: number;
}

export interface SwapFilters {
  status?: "pending" | "accepted" | "rejected" | "completed";
  page?: number;
  limit?: number;
}

export interface CreateItemData {
  title: string;
  description: string;
  category: string;
  type: string;
  size: string;
  condition: string;
  color: string;
  brand?: string;
  images: string[];
  tags: string[];
}

export interface CreateSwapData {
  requestedItem: string;
  offeredItem?: string;
  pointsOffered?: number;
  message?: string;
}

export interface UpdateProfileData {
  fullName?: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  password: string;
}

export interface AdminStats {
  overview: {
    totalUsers: number;
    totalItems: number;
    approvedItems: number;
    pendingItems: number;
    totalSwaps: number;
    completedSwaps: number;
    pendingSwaps: number;
  };
  recentActivity: {
    newUsers: number;
    newItems: number;
    newSwaps: number;
  };
  categoryDistribution: Array<{
    _id: string;
    count: number;
  }>;
  topUsers: Array<{
    id: string;
    fullName: string;
    points: number;
  }>;
}

// Utility types
export type ItemCategory =
  | "dresses"
  | "tops"
  | "bottoms"
  | "accessories"
  | "shoes"
  | "outerwear";
export type ItemSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type ItemCondition = "new" | "like-new" | "good" | "fair";
export type ItemStatus = "available" | "pending" | "swapped" | "rejected";
export type SwapStatus = "pending" | "accepted" | "rejected" | "completed";
export type UserRole = "user" | "admin";
export type SortOption = "newest" | "oldest" | "points-low" | "points-high";
