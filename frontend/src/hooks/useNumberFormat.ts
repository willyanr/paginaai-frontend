import { useCallback } from "react";

export const useNumberFormat = (locale = "pt-BR") => {
  const formatNumber = useCallback((value: number) => {
    return new Intl.NumberFormat(locale).format(value);
  }, [locale]);

  return { formatNumber };
}
