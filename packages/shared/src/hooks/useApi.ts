import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../index";
import type { User, Quest, CreateQuest, UpdateQuest } from "../index";

// API client configured for both web and mobile

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
