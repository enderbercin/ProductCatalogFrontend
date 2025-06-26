import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from './services/order.service';
import { ProductService } from './services/product.service';
import { Order, BulkOrderResult } from './models/order.model';
import { Product } from './models/product.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.html',
  styleUrl: './orders.css',
  standalone: true,
  imports: [CommonModule],
  providers: [OrderService, ProductService]
})
export class Orders implements OnInit {
  orders: Order[] = [];
  loading = false;
  error: string | null = null;
  
  // Otomatik sipariş için
  bulkOrderResult: BulkOrderResult | null = null;
  loadingBulkOrder = false;
  bulkOrderError: string | null = null;

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.error = null;
    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Siparişler yüklenemedi.';
        this.loading = false;
      }
    });
  }

  checkAndPlaceOrders() {
    this.loadingBulkOrder = true;
    this.bulkOrderError = null;
    this.bulkOrderResult = null;
    
    this.orderService.checkAndPlace().subscribe({
      next: (result) => {
        this.bulkOrderResult = result;
        this.loadingBulkOrder = false;
        // Siparişler oluşturulduktan sonra listeyi yenile
        this.fetchOrders();
      },
      error: (err) => {
        this.bulkOrderError = err?.error?.message || 'Otomatik sipariş işlemi başarısız.';
        this.loadingBulkOrder = false;
      }
    });
  }
}
