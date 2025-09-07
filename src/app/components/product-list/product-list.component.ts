import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  // Signals for reactive state management
  products = signal<Product[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getAllProducts().subscribe({
      next: products => {
        this.products.set(products);
        this.isLoading.set(false);
      },
      error: err => {
        this.error.set('Failed to load products. Please try again later.');
        this.isLoading.set(false);
        console.error('Error loading products:', err);
      },
    });
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  formattedPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}
