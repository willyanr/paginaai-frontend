import { useCallback } from "react";

export function useFormatCnpj() {
  const formatCNPJ = useCallback((value: string) => {
    if (!value) return ""; 
    const onlyNums = value.replace(/\D/g, "");
    
    if (onlyNums.length <= 2) {
      return onlyNums;
    } else if (onlyNums.length <= 5) {
      return onlyNums.replace(/(\d{2})(\d{1,3})/, "$1.$2");
    } else if (onlyNums.length <= 8) {
      return onlyNums.replace(/(\d{2})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (onlyNums.length <= 12) {
      return onlyNums.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, "$1.$2.$3/$4");
    } else {
      return onlyNums.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2}).*/,
        "$1.$2.$3/$4-$5"
      );
    }
  }, []);

  return { formatCNPJ };
}
