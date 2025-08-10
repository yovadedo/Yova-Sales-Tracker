export interface PriceHistory {
  id: string;
  price: number;
  date: string;
  type: 'initial' | 'update' | 'sale';
}

export interface Article {
  id: string;
  title: string;
  brand: string;
  size: string;
  description: string;
  purchasePrice?: number;
  salePrice: number;
  createdAt: string;
  sold: boolean;
  soldDate?: string;
  priceHistory: PriceHistory[];
}