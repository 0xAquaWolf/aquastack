// Re-export API types and Eden Treaty client
export * from "./src/api";
export * from "./src/client";
export * from "./src/hooks/useApi";

// Re-export better-auth types
export * from "better-auth";

// Shared utility types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

// Shared app types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuest {
  title: string;
  description: string;
}

export interface UpdateQuest {
  title?: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed";
}

