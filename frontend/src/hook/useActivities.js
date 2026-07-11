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

  // 2. מוטציה להוספת פעילות חדשה
  const addActivityMutation = useMutation({
    mutationFn: activitiesApi.create,
    onSuccess: () => {
      // מרענן את ציר הזמן של הפעילויות עבור הלקוח הזה
      queryClient.invalidateQueries({ queryKey: ["activities", customerId] });
    },
  });

  // 3. מוטציה לעדכון סטטוס הלקוח (lead, in_progress, closed_won)
  const updateStatusMutation = useMutation({
    mutationFn: activitiesApi.updateStatus,
    onSuccess: () => {
      // מרענן גם את הפעילויות וגם את פרטי הלקוח הכלליים כדי שהסטטוס החדש יוצג בכל המערכת
      queryClient.invalidateQueries({ queryKey: ["activities", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  return {
    // נתונים ומצבי טעינה של השליפה
    activities: activitiesQuery.data?.activities || [],
    isLoadingActivities: activitiesQuery.isLoading,
    isErrorActivities: activitiesQuery.isError,

    // פונקציות לביצוע פעולות מהקומפוננטה
    addActivity: addActivityMutation.mutateAsync,
    updateCustomerStatus: updateStatusMutation.mutateAsync,

    // לואודרים לכפתורים
    isAddingActivity: addActivityMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}
