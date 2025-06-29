import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from './services/product.service';
import { Product, CreateProductRequest, FakeStoreProduct } from './models/product.model';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrl: './products.css',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [ProductService]
})
export class Products implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  // Dış ürünler için
  externalProducts: FakeStoreProduct[] = [];
  externalLoading = false;
  externalError: string | null = null;

  // Ekleme formu için
  newProduct: CreateProductRequest = { name: '', threshold: 0, initialStock: 0, fakeStoreProductId: undefined };
  loadingAdd = false;
  formError: string | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.fetchProducts();
    this.fetchExternalProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.error = null;
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Ürünler yüklenemedi.';
        this.loading = false;
      }
    });
  }

  fetchExternalProducts() {
    this.externalLoading = true;
    this.externalError = null;
    this.productService.getExternal().subscribe({
      next: (data) => {
        this.externalProducts = data;
        this.externalLoading = false;
      },
      error: (err) => {
        this.externalError = 'Dış ürünler yüklenemedi.';
        this.externalLoading = false;
      }
    });
  }

  addProduct() {
    this.formError = null;
    if (!this.newProduct.name || this.newProduct.name.length < 2) {
      this.formError = 'Ad zorunlu (en az 2 karakter).';
      return;
    }
    if (this.newProduct.threshold < 0 || this.newProduct.initialStock < 0) {
      this.formError = 'Stok ve kritik seviye 0 veya daha büyük olmalı.';
      return;
    }
    if (this.newProduct.initialStock < this.newProduct.threshold) {
      this.formError = 'Başlangıç stok kritik seviyeden küçük olamaz!';
      return;
    }
    this.loadingAdd = true;

    // CSRF token yoksa önce bir GET ile al, sonra ekle
    if (!this.productService['csrfToken']) {
      this.productService.getAll().subscribe({
        next: () => {
          this.productService.create(this.newProduct).subscribe({
            next: () => {
              this.newProduct = { name: '', threshold: 0, initialStock: 0, fakeStoreProductId: undefined };
              this.loadingAdd = false;
              this.fetchProducts();
            },
            error: (err) => {
              this.formError = err?.error?.message || 'Ürün eklenemedi.';
              this.loadingAdd = false;
            }
          });
        },
        error: (err) => {
          this.formError = 'Token alınamadı, lütfen tekrar deneyin.';
          this.loadingAdd = false;
        }
      });
      return;
    }

    // Token varsa direkt ekle
    this.productService.create(this.newProduct).subscribe({
      next: () => {
        this.newProduct = { name: '', threshold: 0, initialStock: 0, fakeStoreProductId: undefined };
        this.loadingAdd = false;
        this.fetchProducts();
      },
      error: (err) => {
        this.formError = err?.error?.message || 'Ürün eklenemedi.';
        this.loadingAdd = false;
      }
    });
  }

  orderProduct(product: Product) {
    this.productService.decreaseStock(product.productCode, 1).subscribe({
      next: (updated) => {
        // Güncel ürünü products dizisinde güncelle
        const idx = this.products.findIndex(p => p.productCode === product.productCode);
        if (idx > -1) this.products[idx] = updated;
      },
      error: (err) => {
        alert('Stok azaltılamadı!');
      }
    });
  }
}
