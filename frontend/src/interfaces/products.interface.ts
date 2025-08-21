
export interface DataProduct {
  product_type: "digital" | "physical";
  name: string;
  description: string;
  price: number;
  download_url?: string;
  image?: string | File | FileList;
  stock?: number;
  weight?: number;
  dimensions?: string;
  is_active: boolean;
  id: number | null;
}
