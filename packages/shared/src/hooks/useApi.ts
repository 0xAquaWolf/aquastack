import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createApiClient } from "../client";
import type { App } from "@svq/api";
import { Treaty } from "@svq/api";

const app = Treaty<App>("localhost:3333");

// Define types based on API schema
type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

type Quest = {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type CreateQuest = {
  title: string;
  description: string;
};

type UpdateQuest = Partial<{
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
}>;

// Helper to create API client (works in both web and mobile)
const createApiInstance = () => {
  if (typeof window !== "undefined") {
    // Web environment
    return createApiClient("http://localhost:3333");
  } else {
    // Mobile environment
    return createApiClient("http://localhost:3333"); // Will need to be configured for mobile
  }
};

const apiClient = createApiInstance();

// User hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await apiClient.users.get();
      return response.data;
    },
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const response = await apiClient.users[id].get();
      return response.data;
    },
    enabled: !!id,
  });
};

// Quest hooks
export const useQuests = () => {
  return useQuery({
    queryKey: ["quests"],
    queryFn: async () => {
      const response = await apiClient.quests.get();
      return response.data;
    },
  });
};

export const useQuest = (id: string) => {
  return useQuery({
    queryKey: ["quests", id],
    queryFn: async () => {
      const response = await apiClient.quests[id].get();
      return response.data;
    },
    enabled: !!id,
  });
};

export const useCreateQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quest: CreateQuest) => {
      const response = await apiClient.quests.post(quest);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });
};

export const useUpdateQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quest }: { id: string; quest: UpdateQuest }) => {
      const response = await apiClient.quests[id].put(quest);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });
};

export const useDeleteQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.quests[id].delete();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quests"] });
    },
  });
};
