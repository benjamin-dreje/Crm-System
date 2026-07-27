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
      if (typeof window !== "undefined") {
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
          try {
            return JSON.parse(savedUser);
          } catch (e) {
            console.error("Failed to parse user from localStorage", e);
            localStorage.removeItem("currentUser");
          }
        }
      }
      return null;
    },
    // מקבל נתונים התחלתיים מהקאש במידה וקיימים
    initialData: () => queryClient.getQueryData(["currentUser"]),
    staleTime: Infinity,
  });

  // 2. בדיקה אם המשתמש מחובר
  const isAuth = userQuery.data !== null && userQuery.data !== undefined;

  // 3. שליפת כל המשתמשים (רק אם מחובר)
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getAll,
    enabled: isAuth,
  });

  // 4. מוטציה להתחברות
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

  // 5. מוטציה להתנתקות
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

  // 6. מוטציה ליצירת משתמש
  const createUserMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["users"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["sales"],
          refetchType: "all",
        }),
      ]);
    },
  });

  // 7. מוטציה למחיקת משתמש
  const deleteUserMutation = useMutation({
    mutationFn: usersApi.delete,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["users"],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["sales"],
          refetchType: "all",
        }),
      ]);
    },
  });

  return {
    user: userQuery.data,

    users: usersQuery.data || [],
    fetchUsers: usersQuery.refetch,
    isLoadingUsers: usersQuery.isLoading,

    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    createNewUser: createUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,

    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isCreatingUser: createUserMutation.isPending,
    isDeletingUser: deleteUserMutation.isPending,
  };
}
