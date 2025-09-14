import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakProfile } from 'keycloak-js';
import { AuthService } from '../../services/auth.service';
import { UserRoles } from '../../models/user-roles.enum';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-info.component.html',
})
export class UserInfoComponent implements OnInit {
  private readonly authService = inject(AuthService);

  // Signals for reactive state management
  userProfile = signal<KeycloakProfile | null>(null);
  userRoles = signal<string[]>([]);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadUserInfo();
  }

  private async loadUserInfo(): Promise<void> {
    try {
      this.isLoading.set(true);

      const isAuth = await this.authService.isAuthenticated();
      this.isAuthenticated.set(isAuth);

      if (isAuth) {
        const profile = await this.authService.getUserProfile();
        this.userProfile.set(profile);

        // Get user roles from Keycloak
        const roles = this.authService['keycloakService'].getUserRoles();
        this.userRoles.set(roles);
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case UserRoles.ADMIN:
        return 'bg-danger text-white';
      case UserRoles.USER:
        return 'bg-primary text-white';
      default:
        return 'bg-secondary text-white';
    }
  }

  async handleLogin(): Promise<void> {
    await this.authService.login();
  }

  async handleLogout(): Promise<void> {
    await this.authService.logout();
  }

  async refreshUserInfo(): Promise<void> {
    await this.loadUserInfo();
  }

  // Helper methods for template
  getObjectEntries(
    obj: Record<string, any> | undefined
  ): Array<{ key: string; value: any }> {
    if (!obj) return [];
    return Object.entries(obj).map(([key, value]) => ({ key, value }));
  }

  formatAttributeName(key: string): string {
    return key
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  formatAttributeValue(value: any): string {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value || 'N/A');
  }
}
