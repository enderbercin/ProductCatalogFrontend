import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, CreateProductRequest, FakeStoreProduct, ProductStockRoman } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://localhost:5164/api/products';
  private csrfToken: string | null = null;

  constructor(private http: HttpClient) {
    // Uygulama açılırken bir GET isteğiyle tokenı al
    this.http.get<Product[]>(this.apiUrl, { observe: 'response' }).subscribe(resp => {
      const token = resp.headers.get('X-CSRF-Token');
      if (token) this.csrfToken = token;
    });
  }

  getAll(): Observable<Product[]> {
    // Her çağrıda tokenı güncelle
    return new Observable<Product[]>(observer => {
      this.http.get<Product[]>(this.apiUrl, { observe: 'response' }).subscribe(resp => {
        const token = resp.headers.get('X-CSRF-Token');
        if (token) this.csrfToken = token;
        observer.next(resp.body || []);
        observer.complete();
      }, err => observer.error(err));
    });
  }

  getByCode(productCode: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${productCode}`);
  }

  create(product: CreateProductRequest): Observable<Product> {
    if (!this.csrfToken) {
      // Token yoksa önce bir GET ile token al, sonra POST at
      return new Observable<Product>(observer => {
        this.http.get<Product[]>(this.apiUrl, { observe: 'response' }).subscribe(resp => {
          const token = resp.headers.get('X-CSRF-Token');
          if (token) this.csrfToken = token;
          const headers = new HttpHeaders().set('X-CSRF-Token', this.csrfToken || '');
          this.http.post<Product>(this.apiUrl, product, { headers }).subscribe(
            data => { observer.next(data); observer.complete(); },
            err => observer.error(err)
          );
        }, err => observer.error(err));
      });
    }
    const headers = new HttpHeaders().set('X-CSRF-Token', this.csrfToken || '');
    return this.http.post<Product>(this.apiUrl, product, { headers });
  }

  getExternal(): Observable<FakeStoreProduct[]> {
    return this.http.get<FakeStoreProduct[]>(`${this.apiUrl}/external`);
  }

  getLowStock(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/low-stock`);
  }

  getStockInRoman(productCode: string): Observable<ProductStockRoman> {
    return this.http.get<ProductStockRoman>(`${this.apiUrl}/${productCode}/stock-roman`);
  }

  convertToRoman(number: number): Observable<{ number: number, roman: string }> {
    return this.http.get<{ number: number, roman: string }>(`${this.apiUrl}/utils/roman/${number}`);
  }
} 