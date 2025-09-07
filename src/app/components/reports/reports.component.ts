import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  // Static data for reports
  salesData = [
    { month: 'Jan', sales: 12500, orders: 45 },
    { month: 'Feb', sales: 15200, orders: 52 },
    { month: 'Mar', sales: 18900, orders: 68 },
    { month: 'Apr', sales: 22100, orders: 78 },
    { month: 'May', sales: 19800, orders: 71 },
    { month: 'Jun', sales: 25600, orders: 89 },
  ];

  topProducts = [
    { name: 'Laptop Dell XPS 13', sales: 45, revenue: '$58,495' },
    { name: 'iPhone 15 Pro', sales: 38, revenue: '$37,962' },
    { name: 'Samsung Galaxy S24', sales: 32, revenue: '$25,599' },
    { name: 'MacBook Pro M3', sales: 28, revenue: '$55,972' },
    { name: 'iPad Air', sales: 25, revenue: '$14,975' },
  ];

  inventoryAlerts = [
    { product: 'iPhone 15 Pro', current: 0, min: 5, status: 'critical' },
    { product: 'iPad Air', current: 2, min: 10, status: 'warning' },
    { product: 'AirPods Pro', current: 3, min: 8, status: 'warning' },
    { product: 'Samsung Galaxy S24', current: 18, min: 15, status: 'good' },
    { product: 'MacBook Pro M3', current: 8, min: 5, status: 'good' },
  ];

  exportFormats = ['PDF', 'Excel', 'CSV', 'JSON'];

  calculateAverageOrderValue(sales: number, orders: number): number {
    return Math.round(sales / orders);
  }
}
