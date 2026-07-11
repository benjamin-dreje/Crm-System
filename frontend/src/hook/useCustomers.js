import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customersApi } from "../api/customersApi";

export function useCustomers(customerId = null) {
  const queryClient = useQueryClient();

  // 1. שליפת כל הלקוחות
  const customersQuery = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
    enabled: !customerId, // רץ רק אם לא בעמוד לקוח ספציפי
  });

  // 2. שליפת לקוח בודד לפי ID
  const customerDetailQuery = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => customersApi.getById(customerId),
    enabled: !!customerId,
  });

  // 3. יצירת לקוח
  const createMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] }); // מרענן את הרשימה אוטומטית
    },
  });

  // 4. עדכון לקוח
  const updateMutation = useMutation({
    mutationFn: customersApi.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
    },
  });

  // 5. מחיקת לקוח
  const deleteMutation = useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  return {
    customers: customersQuery.data?.customers || [],
    customer: customerDetailQuery.data,
    isLoadingCustomers: customersQuery.isLoading,
    isLoadingDetail: customerDetailQuery.isLoading,

    // פונקציות לפעולות
    createCustomer: createMutation.mutateAsync,
    updateCustomer: updateMutation.mutateAsync,
    deleteCustomer: deleteMutation.mutateAsync,

    // ספינרים / לואודרים
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
