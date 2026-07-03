import { useQuery } from "@tanstack/react-query";
import { salesApi } from "../api/salesApi";

export function useSales() {
  // שליפת כל המכירות מהדאטה-בייס
  const salesQuery = useQuery({
    queryKey: ["sales"],
    queryFn: salesApi.getAll,
    // אופציונלי: אם אתה רוצה שהנתונים יתרעננו אוטומטית בכל דקה בגלל שמדובר במכירות בזמן אמת
    refetchInterval: 1000 * 60,
  });

  return {
    sales: salesQuery.data,
    isLoadingSales: salesQuery.isLoading,
    isErrorSales: salesQuery.isError,
    error: salesQuery.error,
  };
}
