"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }) {
  // משתמשים ב-useState כדי למנוע יצירה מחדש של הסטייט בכל רינדור של השרת
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // הנתונים נחשבים "טריים" ל-5 דקות
            refetchOnWindowFocus: false, // מונע קריאות מיותרות לשרת כשעוברים טאב
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
