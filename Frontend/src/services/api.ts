import axios, { AxiosResponse } from "axios";
import {
  User,
  Item,
  Swap,
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  ItemFilters,
  SwapFilters,
  CreateItemData,
  CreateSwapData,
  UpdateProfileData,
  RegisterData,
  LoginData,
  ForgotPasswordData,
  ResetPasswordData,
  AdminStats,
} from "../types";

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/register", data),

  login: (data: LoginData): Promise<AxiosResponse<AuthResponse>> =>
    api.post("/auth/login", data),

  getProfile: (): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.get("/auth/profile"),

  updateProfile: (
    data: UpdateProfileData
  ): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.put("/auth/profile", data),

  forgotPassword: (
    data: ForgotPasswordData
  ): Promise<AxiosResponse<ApiResponse>> =>
    api.post("/auth/forgot-password", data),

  resetPassword: (
    token: string,
    data: ResetPasswordData
  ): Promise<AxiosResponse<ApiResponse>> =>
    api.post(`/auth/reset-password/${token}`, data),
};

// Items API
export const itemsAPI = {
  getItems: (
    filters: ItemFilters = {}
  ): Promise<AxiosResponse<PaginatedResponse<Item>>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });
    return api.get(`/items?${params.toString()}`);
  },

  getItem: (id: string): Promise<AxiosResponse<ApiResponse<{ item: Item }>>> =>
    api.get(`/items/${id}`),

  createItem: (
    data: CreateItemData
  ): Promise<AxiosResponse<ApiResponse<{ item: Item }>>> =>
    api.post("/items", data),

  updateItem: (
    id: string,
    data: Partial<CreateItemData>
  ): Promise<AxiosResponse<ApiResponse<{ item: Item }>>> =>
    api.put(`/items/${id}`, data),

  deleteItem: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/items/${id}`),

  uploadImages: (
    id: string,
    formData: FormData
  ): Promise<
    AxiosResponse<ApiResponse<{ item: Item; uploadedImages: string[] }>>
  > =>
    api.post(`/items/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getUserItems: (
    filters: { page?: number; limit?: number } = {}
  ): Promise<AxiosResponse<PaginatedResponse<Item>>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    return api.get(`/items/user?${params.toString()}`);
  },
};

// Swaps API
export const swapsAPI = {
  createSwap: (
    data: CreateSwapData
  ): Promise<AxiosResponse<ApiResponse<{ swap: Swap }>>> =>
    api.post("/swaps", data),

  getUserSwaps: (
    filters: SwapFilters = {}
  ): Promise<AxiosResponse<PaginatedResponse<Swap>>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.append(key, value.toString());
      }
    });
    return api.get(`/swaps?${params.toString()}`);
  },

  acceptSwap: (
    id: string
  ): Promise<AxiosResponse<ApiResponse<{ swap: Swap }>>> =>
    api.put(`/swaps/${id}/accept`),

  rejectSwap: (
    id: string,
    rejectionReason?: string
  ): Promise<AxiosResponse<ApiResponse<{ swap: Swap }>>> =>
    api.put(`/swaps/${id}/reject`, { rejectionReason }),

  completeSwap: (
    id: string
  ): Promise<AxiosResponse<ApiResponse<{ swap: Swap }>>> =>
    api.put(`/swaps/${id}/complete`),
};

// Admin API
export const adminAPI = {
  getUsers: (
    filters: { page?: number; limit?: number } = {}
  ): Promise<AxiosResponse<PaginatedResponse<User>>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    return api.get(`/admin/users?${params.toString()}`);
  },

  getPendingItems: (
    filters: { page?: number; limit?: number } = {}
  ): Promise<AxiosResponse<PaginatedResponse<Item>>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    return api.get(`/admin/items/pending?${params.toString()}`);
  },

  approveItem: (
    id: string
  ): Promise<AxiosResponse<ApiResponse<{ item: Item }>>> =>
    api.put(`/admin/items/${id}/approve`),

  rejectItem: (
    id: string,
    rejectionReason: string
  ): Promise<AxiosResponse<ApiResponse<{ item: Item }>>> =>
    api.put(`/admin/items/${id}/reject`, { rejectionReason }),

  deleteItem: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/admin/items/${id}`),

  getStats: (): Promise<AxiosResponse<ApiResponse<AdminStats>>> =>
    api.get("/admin/stats"),

  updateUserRole: (
    id: string,
    role: "user" | "admin"
  ): Promise<AxiosResponse<ApiResponse<{ user: User }>>> =>
    api.put(`/admin/users/${id}/role`, { role }),

  bulkApproveItems: (
    itemIds: string[]
  ): Promise<AxiosResponse<ApiResponse<{ modifiedCount: number }>>> =>
    api.post("/admin/items/bulk-approve", { itemIds }),
};

// Upload API (for file uploads)
export const uploadAPI = {
  uploadFile: (
    file: File,
    folder: string = "items"
  ): Promise<AxiosResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    return api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Health check API
export const healthAPI = {
  check: (): Promise<AxiosResponse<ApiResponse>> => api.get("/health"),
};

export { api };
