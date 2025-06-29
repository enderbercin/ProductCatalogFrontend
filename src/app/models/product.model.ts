export interface Product {
  productCode: string;
  name: string;
  threshold: number;
  initialStock: number;
  currentStock: number;
  createdAt: string;
  updatedAt?: string;
  fakeStoreId?: number;
  description?: string;
  category?: string;
  image?: string;
  price?: number;
  ratingRate?: number;
  ratingCount?: number;
  isMatched?: boolean;
  stockInRoman: string;
}

export interface CreateProductRequest {
  name: string;
  threshold: number;
  initialStock: number;
  fakeStoreProductId?: number;
}

export interface FakeStoreProduct {
  id: number;
  title?: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface ProductStockRoman {
  productCode: string;
  productName: string;
  stockInNumbers: number;
  stockInRoman: string;
} 