import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from './services/product.service';
import { Product, ProductStockRoman } from './models/product.model';

@Component({
  selector: 'app-low-stock',
  templateUrl: './low-stock.html',
  styleUrl: './low-stock.css',
  standalone: true,
  imports: [CommonModule],
  providers: [ProductService]
})
export class LowStock implements OnInit {
  lowStockProducts: Product[] = [];
  loading = false;
  error: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchLowStockProducts();
  }

  fetchLowStockProducts() {
    this.loading = true;
    this.error = null;
    this.productService.getLowStock().subscribe({
      next: (data) => {
        this.lowStockProducts = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Kritik stoklu ürünler yüklenemedi.';
        this.loading = false;
      }
    });
  }
}
