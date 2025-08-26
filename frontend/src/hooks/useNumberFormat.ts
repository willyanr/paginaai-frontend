import { useCallback } from "react";

export const useNumberFormat = (locale = "pt-BR") => {
  const formatNumber = useCallback((value: number | string) => {
    const numericValue = typeof value === "string" ? parseFloat(value) : value;

    if (isNaN(numericValue)) return "0";

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2,
    }).format(numericValue);
  }, [locale]);

  return { formatNumber };
};
