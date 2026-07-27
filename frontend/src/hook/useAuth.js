import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import { useRouter } from "next/navigation";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 1. שליפת המשתמש המחובר
  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => {
      const cached = queryClient.getQueryData(["currentUser"]);
      if (cached) return cached;

      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
          try {
            return JSON.parse(savedUser);
          } catch (e) {
            console.error("Failed to parse user from localStorage", e);
          }
        }
      }
      return null;
    },
    staleTime: Infinity,
  });

  // 2. שליפת כל המשתמשים (המשתנה שהיה חסר)
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getAll,
    enabled: false,
  });

  // 3. מוטציה להתחברות
  const loginMutation = useMutation({
    mutationFn: usersApi.login,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], data.user);
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUser", JSON.stringify(data.user));
      }
      router.push("/crm");
    },
  });

  // 4. מוטציה להתנתקות
  const logoutMutation = useMutation({
    mutationFn: usersApi.logout,
    onSuccess: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("currentUser");
      }
      queryClient.clear();
      router.push("/login");
    },
  });

  // 5. מוטציה ליצירת משתמש
  const createUserMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    user: userQuery.data,

    users: usersQuery.data,
    fetchUsers: usersQuery.refetch,
    isLoadingUsers: usersQuery.isLoading,

    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    createNewUser: createUserMutation.mutateAsync,

    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isCreatingUser: createUserMutation.isPending,
  };
}
