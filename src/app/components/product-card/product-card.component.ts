import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.interface';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  get stockStatus(): { text: string; class: string } {
    if (this.product.quantity === 0) {
      return { text: 'Out of Stock', class: 'out-of-stock' };
    } else if (this.product.quantity < 10) {
      return { text: 'Low Stock', class: 'low-stock' };
    } else {
      return { text: 'In Stock', class: 'in-stock' };
    }
  }

  get formattedPrice(): string {
    return `$${this.product.price.toFixed(2)}`;
  }
}
