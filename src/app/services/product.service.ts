import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = environment.apiUrl;

  private async getAuthHeaders(): Promise<HttpHeaders> {
    const token = await this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  /**
   * Get all products from the inventory service
   */
  async getAllProducts(): Promise<Observable<Product[]>> {
    const headers = await this.getAuthHeaders();
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { headers });
  }

  /**
   * Get a specific product by ID
   */
  async getProductById(id: string): Promise<Observable<Product>> {
    const headers = await this.getAuthHeaders();
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`, { headers });
  }

  /**
   * Create a new product (requires authentication)
   */
  async createProduct(product: Product): Promise<Observable<Product>> {
    const headers = await this.getAuthHeaders();
    return this.http.post<Product>(`${this.apiUrl}/products`, product, {
      headers,
    });
  }

  /**
   * Update an existing product (requires authentication)
   */
  async updateProduct(
    id: string,
    product: Product
  ): Promise<Observable<Product>> {
    const headers = await this.getAuthHeaders();
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, product, {
      headers,
    });
  }

  /**
   * Delete a product (requires authentication)
   */
  async deleteProduct(id: string): Promise<Observable<void>> {
    const headers = await this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`, { headers });
  }
}
