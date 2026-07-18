import { getProductDetails } from "@/api/retro-api";
import { useQuery } from "@tanstack/react-query";

export const useProductDetails = (id: string) => {
  return useQuery({
    queryKey: ["product-details", id],
    queryFn: () => getProductDetails(id),
    enabled: !!id,
  });
};
