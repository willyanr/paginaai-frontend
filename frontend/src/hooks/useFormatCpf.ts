import { useCallback } from "react";

export function useFormatCpf() {
    const formatCPF = useCallback((value: string) => {
      if (!value) return "";
      const onlyNums = value.replace(/\D/g, "");
      if (onlyNums.length <= 3) {
        return onlyNums;
      } else if (onlyNums.length <= 6) {
        return onlyNums.replace(/(\d{3})(\d{1,3})/, "$1.$2");
      } else if (onlyNums.length <= 9) {
        return onlyNums.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
      } else {
        return onlyNums.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2}).*/, "$1.$2.$3-$4");
      }
    }, []);
  
    return { formatCPF };
  }