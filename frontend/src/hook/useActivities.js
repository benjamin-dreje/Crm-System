import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { activitiesApi } from "../api/activitiesApi";

export function useActivities(customerId) {
  const queryClient = useQueryClient();

  // 1. שליפת היסטוריית פעילות של לקוח ספציפי
  const activitiesQuery = useQuery({
    queryKey: ["activities", customerId],
    queryFn: () => activitiesApi.getByCustomerId(customerId),
    enabled: !!customerId, // ירוץ רק אם קיים ID של לקוח
  });

  // 2. חדש: שליפת אנליטיקות/סטטוסים כלליים של כל הפעילויות
  const globalStatusQuery = useQuery({
    queryKey: ["activitiesStatus"],
    queryFn: activitiesApi.getActivitiesStatus,
    // אם הנתונים האלו משמשים לדשבורד ראשי, אולי תרצה שהם יתרעננו ברקע
    staleTime: 1000 * 60 * 5, // 5 דקות של נתונים "טריים"
  });

  // 3. מוטציה להוספת פעילות חדשה
  const addActivityMutation = useMutation({
    mutationFn: activitiesApi.create,
    onSuccess: () => {
      // מרענן את ציר הזמן של הפעילויות עבור הלקוח הזה
      queryClient.invalidateQueries({ queryKey: ["activities", customerId] });
      // מרענן גם את הסטטיסטיקות הכלליות כי נוספה פעילות חדשה במערכת
      queryClient.invalidateQueries({ queryKey: ["activitiesStatus"] });
    },
  });

  // 4. מוטציה לעדכון סטטוס הלקוח (in_progress, closed_won)
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
    // --- נתוני הלקוח הספציפי ---
    activities: activitiesQuery.data?.activities || [],
    isLoadingActivities: activitiesQuery.isLoading,
    isErrorActivities: activitiesQuery.isError,
    count: activitiesQuery.data?.count || 0,

    // --- נתוני סטטוסים ואנליטיקות כלליות (החדש) ---
    globalStatusData: globalStatusQuery.data,
    isLoadingGlobalStatus: globalStatusQuery.isLoading,
    isErrorGlobalStatus: globalStatusQuery.isError,

    // --- פונקציות לביצוע פעולות מהקומפוננטה ---
    addActivity: addActivityMutation.mutateAsync,
    updateCustomerStatus: updateStatusMutation.mutateAsync, // קריאה ישירה לפונקציית ה-PUT שלך

    // --- לואודרים לכפתורים (Pending במקום isLoading בגרסאות החדשות של React Query) ---
    isAddingActivity: addActivityMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}
