import { useCallback } from "react";
import { format, parseISO } from "date-fns";

export function useFormattedDate() {
  const formatDate = useCallback((dateString?: string) => {
    if (!dateString) return "";
    try {
      const parsedDate = parseISO(dateString);
      return format(parsedDate, "dd/MM/yyyy"); // ajuste o formato como quiser
    } catch {
      console.error("Invalid date format:", dateString);
      return dateString;
    }
  }, []);

  return { formatDate };
}
