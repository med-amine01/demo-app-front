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
  styleUrls: ['./product-detail.component.scss']
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

  loadProduct(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    
    if (!productId) {
      this.error.set('Product ID is required');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.product.set(product);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load product details. Please try again later.');
        this.isLoading.set(false);
        console.error('Error loading product:', err);
      }
    });
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
}
