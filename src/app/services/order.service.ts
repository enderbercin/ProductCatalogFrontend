import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, BulkOrderResult } from '../models/order.model';
import { ProductService } from './product.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  private csrfToken: string | null = null;

  constructor(private http: HttpClient, private productService: ProductService) {
    // ProductService'den token'ı al
    this.csrfToken = this.productService['csrfToken'];
  }

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  checkAndPlace(): Observable<BulkOrderResult> {
    if (!this.csrfToken) {
      // Token yoksa önce ProductService'den al
      return new Observable<BulkOrderResult>(observer => {
        this.productService.getAll().subscribe({
          next: () => {
            this.csrfToken = this.productService['csrfToken'];
            const headers = new HttpHeaders().set('X-CSRF-Token', this.csrfToken || '');
            this.http.post<BulkOrderResult>(`${this.apiUrl}/check-and-place`, {}, { headers }).subscribe(
              data => { observer.next(data); observer.complete(); },
              err => observer.error(err)
            );
          },
          error: (err) => observer.error(err)
        });
      });
    }
    const headers = new HttpHeaders().set('X-CSRF-Token', this.csrfToken || '');
    return this.http.post<BulkOrderResult>(`${this.apiUrl}/check-and-place`, {}, { headers });
  }
} 