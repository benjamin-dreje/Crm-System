import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activitiesApi } from "../api/activitiesApi";

// ==========================================
// 1. Hook עצמאי לאנליטיקות וסטטוסים גלובליים
// ==========================================
export function useActivitiesAnalytics() {
  const globalStatusQuery = useQuery({
    queryKey: ["activitiesStatus"],
    queryFn: activitiesApi.getActivitiesStatus,
    staleTime: 1000 * 60 * 5, // 5 דקות של נתונים "טריים" בתוך ה-Cache
  });

  return {
    globalStatusData: globalStatusQuery.data,
    isLoadingGlobalStatus: globalStatusQuery.isLoading,
    isErrorGlobalStatus: globalStatusQuery.isError,
    refetchGlobalStatus: globalStatusQuery.refetch,
  };
}

// ==========================================
// 2. Hook ממוקד לפעילויות של לקוח ספציפי
// ==========================================
export function useActivities(customerId) {
  const queryClient = useQueryClient();

  // שליפת היסטוריית פעילות של לקוח ספציפי
  const activitiesQuery = useQuery({
    queryKey: ["activities", customerId],
    queryFn: () => activitiesApi.getByCustomerId(customerId),
    enabled: !!customerId, // ירוץ רק אם קיים ID של לקוח (לא ירוץ בדף הבית!)
  });

  // מוטציה להוספת פעילות חדשה
  const addActivityMutation = useMutation({
    mutationFn: activitiesApi.create,
    onSuccess: () => {
      // מרענן את ציר הזמן של הפעילויות עבור הלקוח הזה
      queryClient.invalidateQueries({ queryKey: ["activities", customerId] });
      // מרענן גם את הסטטיסטיקות הכלליות בדשבורד כי נוספה פעילות חדשה במערכת
      queryClient.invalidateQueries({ queryKey: ["activitiesStatus"] });
    },
  });

  // מוטציה לעדכון סטטוס הלקוח (in_progress, closed_won)
  const updateStatusMutation = useMutation({
    mutationFn: activitiesApi.updateStatus,
    onSuccess: () => {
      // מרענן את כל השילובים הרלוונטיים כדי שהטבלאות והדשבורדים יתעדכנו מיד
      queryClient.invalidateQueries({ queryKey: ["activities", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["activitiesStatus"] });
    },
  });

  return {
    // נתוני הלקוח הספציפי
    activities: activitiesQuery.data?.activities || [],
    isLoadingActivities: activitiesQuery.isLoading,
    isErrorActivities: activitiesQuery.isError,
    count: activitiesQuery.data?.count || 0,

    // פונקציות לביצוע פעולות
    addActivity: addActivityMutation.mutateAsync,
    updateCustomerStatus: updateStatusMutation.mutateAsync,

    // מצבי טעינה (Pending) עבור כפתורים
    isAddingActivity: addActivityMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}
