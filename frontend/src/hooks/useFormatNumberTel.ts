import { useCallback } from "react";

export function usePhoneMask() {
  const formatPhone = useCallback((value: string) => {
    const onlyNums = value.replace(/\D/g, "");

    if (onlyNums.length > 10) {
      return onlyNums.replace(/(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (onlyNums.length > 5) {
      return onlyNums.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (onlyNums.length > 2) {
      return onlyNums.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      return onlyNums.replace(/(\d{0,2})/, "($1");
    }
  }, []);

  return { formatPhone };
}
