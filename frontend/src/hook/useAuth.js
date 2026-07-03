import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../api/usersApi";
import { useRouter } from "next/navigation";

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 1. שליפת כל המשתמשים (שימושי למסכי ניהול צוות/עובדים ב-CRM)
  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: usersApi.getAll,
    enabled: false, // לא ירוץ אוטומטית, נפעיל אותו רק במסך הניהול המתאים באמצעות refetch
  });

  // 2. מוטציה להתחברות משתמש
  const loginMutation = useMutation({
    mutationFn: usersApi.login,
    onSuccess: (data) => {
      // שומרים את נתוני המשתמש ב-Cache של TanStack Query
      queryClient.setQueryData(["currentUser"], data.user);
      // מעבירים את המשתמש ישירות למערכת ה-CRM
      router.push("/crm");
    },
  });

  // 3. מוטציה להתנתקות מהמערכת
  const logoutMutation = useMutation({
    mutationFn: usersApi.logout,
    onSuccess: () => {
      // מנקים את כל ה-Cache של האפליקציה כדי שלא יישאר מידע של הלקוחות בזיכרון
      queryClient.clear();
      // מחזירים לעמוד הלוגין
      router.push("/login");
    },
  });

  // 4. מוטציה ליצירת עובד/משתמש חדש (דורש הרשאת אדמין בבאקנד שלך)
  const createUserMutation = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); // מרענן את רשימת העובדים
    },
  });

  return {
    // נתונים
    users: usersQuery.data,
    fetchUsers: usersQuery.refetch,
    isLoadingUsers: usersQuery.isLoading,

    // פעולות (Mutations)
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    createNewUser: createUserMutation.mutateAsync,

    // מצבי טעינה לפעולות (בשביל להראות "מתחבר..." בכפתור)
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isCreatingUser: createUserMutation.isPending,
  };
}
