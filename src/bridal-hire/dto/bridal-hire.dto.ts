export interface CreateBridalHireWigDto {
  wigName: string;
  lengths: string; // comma-separated
  description?: string;
  price: number;
  discount?: number;
  productId: number;
  imageUrl?: string;
}
