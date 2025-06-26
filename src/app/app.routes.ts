import { Routes } from '@angular/router';
import { Products } from './products';
import { Orders } from './orders';
import { LowStock } from './low-stock';

export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: Products },
  { path: 'orders', component: Orders },
  { path: 'low-stock', component: LowStock },
];
