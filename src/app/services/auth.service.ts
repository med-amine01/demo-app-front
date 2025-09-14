import { Injectable, inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { UserRoles } from '../models/user-roles.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly keycloakService = inject(KeycloakService);

  async isAuthenticated(): Promise<boolean> {
    return await this.keycloakService.isLoggedIn();
  }

  async getUserProfile() {
    if (await this.isAuthenticated()) {
      return await this.keycloakService.loadUserProfile();
    }
    return null;
  }

  async getToken(): Promise<string | undefined> {
    return await this.keycloakService.getToken();
  }

  async hasRole(role: UserRoles): Promise<boolean> {
    return await this.keycloakService.isUserInRole(role);
  }

  async hasAnyRole(roles: UserRoles[]): Promise<boolean> {
    const userRoles = this.keycloakService.getUserRoles();
    return roles.some(role => userRoles.includes(role));
  }

  async hasAllRoles(roles: UserRoles[]): Promise<boolean> {
    const userRoles = this.keycloakService.getUserRoles();
    return roles.every(role => userRoles.includes(role));
  }

  async isAdmin(): Promise<boolean> {
    return await this.hasRole(UserRoles.ADMIN);
  }

  async isUser(): Promise<boolean> {
    return await this.hasRole(UserRoles.USER);
  }

  async login(): Promise<void> {
    await this.keycloakService.login({
      redirectUri: window.location.origin,
    });
  }

  async logout(): Promise<void> {
    await this.keycloakService.logout(window.location.origin);
  }
}
