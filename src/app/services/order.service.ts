import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, BulkOrderResult } from '../models/order.model';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = 'http://localhost:5164/api/orders';

  constructor(private http: HttpClient, private productService: ProductService) {}

  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getById(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
  }

  checkAndPlace(): Observable<BulkOrderResult> {
    const token = this.productService['csrfToken'];
    const headers = new HttpHeaders().set('X-CSRF-Token', token || '');
    return this.http.post<BulkOrderResult>(`${this.apiUrl}/check-and-place`, {}, { headers });
  }
} 