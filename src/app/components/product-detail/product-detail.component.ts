import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  // Signals for reactive state management
  product = signal<Product | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProduct();
  }

  async loadProduct(): Promise<void> {
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId) {
      this.error.set('Product ID is required');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    try {
      const productObservable =
        await this.productService.getProductById(productId);
      productObservable.subscribe({
        next: product => {
          this.product.set(product);
          this.isLoading.set(false);
        },
        error: err => {
          this.error.set(
            'Failed to load product details. Please try again later.'
          );
          this.isLoading.set(false);
        },
      });
    } catch (err) {
      this.error.set('Failed to load product details. Please try again later.');
      this.isLoading.set(false);
    }
  }

  get stockStatus(): { text: string; class: string } {
    const product = this.product();
    if (!product) return { text: '', class: '' };

    if (product.quantity === 0) {
      return { text: 'Out of Stock', class: 'out-of-stock' };
    } else if (product.quantity < 10) {
      return { text: 'Low Stock', class: 'low-stock' };
    } else {
      return { text: 'In Stock', class: 'in-stock' };
    }
  }

  get formattedPrice(): string {
    const product = this.product();
    return product ? `$${product.price.toFixed(2)}` : '';
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  addToCart(): void {
    const product = this.product();
    if (product && product.quantity > 0) {
      // TODO: Implement cart functionality
      alert(`${product.name} added to cart!`);
    }
  }

  editProduct(): void {
    const product = this.product();
    if (product) {
      this.router.navigate(['/products/edit', product.id]);
    }
  }

  async deleteProduct(): Promise<void> {
    const product = this.product();
    if (
      product &&
      confirm(`Are you sure you want to delete "${product.name}"?`)
    ) {
      this.isLoading.set(true);
      this.error.set(null);

      try {
        const deleteObservable = await this.productService.deleteProduct(
          product.id
        );
        deleteObservable.subscribe({
          next: () => {
            this.router.navigate(['/products']);
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
