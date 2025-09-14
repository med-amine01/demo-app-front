import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
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
  private readonly router = inject(Router);

  // Signals for reactive state management
  products = signal<Product[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProducts();
  }

  async loadProducts(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const productsObservable = await this.productService.getAllProducts();
      productsObservable.subscribe({
        next: products => {
          this.products.set(products);
          this.isLoading.set(false);
        },
        error: err => {
          this.error.set('Failed to load products. Please try again later.');
          this.isLoading.set(false);
        },
      });
    } catch (err) {
      this.error.set('Failed to load products. Please try again later.');
      this.isLoading.set(false);
    }
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }

  formattedPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  addProduct(): void {
    this.router.navigate(['/products/add']);
  }

  editProduct(productId: string): void {
    this.router.navigate(['/products/edit', productId]);
  }

  async deleteProduct(productId: string): Promise<void> {
    if (confirm('Are you sure you want to delete this product?')) {
      this.isLoading.set(true);
      this.error.set(null);

      try {
        const deleteObservable =
          await this.productService.deleteProduct(productId);
        deleteObservable.subscribe({
          next: () => {
            this.loadProducts();
          },
          error: err => {
            this.error.set('Failed to delete product. Please try again later.');
            this.isLoading.set(false);
          },
        });
      } catch (err) {
        this.error.set('Failed to delete product. Please try again later.');
        this.isLoading.set(false);
      }
    }
  }
}
