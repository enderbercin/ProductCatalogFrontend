export interface Order {
  orderId: string;
  productCode: string;
  supplierName: string;
  price: number;
  quantity: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  createdAt: string;
  completedAt?: string;
}

export interface OrderDto extends Order {}

export interface OrderResult {
  success: boolean;
  orderId: string;
  productCode: string;
  message: string;
  price?: number;
  supplierName?: string;
}

export interface BulkOrderResult {
  results: OrderResult[];
  totalProcessed: number;
  successfulOrders: number;
  failedOrders: number;
} 