import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  // Static data for dashboard
  stats = [
    {
      title: 'Total Products',
      value: '156',
      icon: 'bi-box',
      color: 'primary',
      change: '+12%',
    },
    {
      title: 'In Stock',
      value: '142',
      icon: 'bi-check-circle',
      color: 'success',
      change: '+8%',
    },
    {
      title: 'Out of Stock',
      value: '14',
      icon: 'bi-x-circle',
      color: 'danger',
      change: '-3%',
    },
    {
      title: 'Total Value',
      value: '$45,230',
      icon: 'bi-currency-dollar',
      color: 'info',
      change: '+15%',
    },
  ];

  recentProducts = [
    {
      name: 'Laptop Dell XPS 13',
      price: '$1,299.99',
      stock: 25,
      status: 'In Stock',
    },
    {
      name: 'iPhone 15 Pro',
      price: '$999.00',
      stock: 0,
      status: 'Out of Stock',
    },
    {
      name: 'Samsung Galaxy S24',
      price: '$799.99',
      stock: 18,
      status: 'In Stock',
    },
    {
      name: 'MacBook Pro M3',
      price: '$1,999.00',
      stock: 8,
      status: 'In Stock',
    },
    { name: 'iPad Air', price: '$599.00', stock: 0, status: 'Out of Stock' },
  ];

  topCategories = [
    { name: 'Electronics', count: 45, percentage: 28.8 },
    { name: 'Computers', count: 32, percentage: 20.5 },
    { name: 'Mobile Phones', count: 28, percentage: 17.9 },
    { name: 'Accessories', count: 25, percentage: 16.0 },
    { name: 'Others', count: 26, percentage: 16.7 },
  ];

  getCurrentDate(): string {
    return new Date().toLocaleDateString();
  }
}
