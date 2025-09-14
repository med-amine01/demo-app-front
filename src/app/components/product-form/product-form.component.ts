import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);

  // Signals for reactive state management
  isLoading = signal(false);
  error = signal<string | null>(null);
  isEditMode = signal(false);
  productId = signal<string | null>(null);

  productForm: FormGroup;

  constructor() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(id);
      this.loadProduct(id);
    }
  }

  async loadProduct(id: string): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      const productObservable = await this.productService.getProductById(id);
      productObservable.subscribe({
        next: product => {
          this.productForm.patchValue({
            name: product.name,
            price: product.price,
            quantity: product.quantity,
          });
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

  async onSubmit(): Promise<void> {
    if (this.productForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);

      const formData = this.productForm.value;
      const product: Product = {
        id: this.productId() || '',
        name: formData.name,
        price: formData.price,
        quantity: formData.quantity,
      };

      try {
        if (this.isEditMode()) {
          const updateObservable = await this.productService.updateProduct(
            this.productId()!,
            product
          );
          updateObservable.subscribe({
            next: () => {
              this.router.navigate(['/products']);
            },
            error: err => {
              this.error.set(
                'Failed to update product. Please try again later.'
              );
              this.isLoading.set(false);
            },
          });
        } else {
          const createObservable =
            await this.productService.createProduct(product);
          createObservable.subscribe({
            next: () => {
              this.router.navigate(['/products']);
            },
            error: err => {
              this.error.set(
                'Failed to create product. Please try again later.'
              );
              this.isLoading.set(false);
            },
          });
        }
      } catch (err) {
        this.error.set('An error occurred. Please try again later.');
        this.isLoading.set(false);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.productForm.controls).forEach(key => {
      const control = this.productForm.get(key);
      control?.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  getFieldError(fieldName: string): string {
    const field = this.productForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['min']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['min'].min}`;
      }
    }
    return '';
  }

  get isFieldInvalid(): (fieldName: string) => boolean {
    return (fieldName: string) => {
      const field = this.productForm.get(fieldName);
      return !!(field?.invalid && field.touched);
    };
  }
}
