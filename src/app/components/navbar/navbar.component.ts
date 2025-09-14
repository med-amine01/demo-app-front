import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserRoles } from '../../models/user-roles.enum';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);

  // Signals for reactive state management
  isAuthenticated = signal(false);
  userProfile = signal<any>(null);
  isAdmin = signal(false);
  isUser = signal(false);

  async ngOnInit() {
    await this.updateAuthState();
  }

  private async updateAuthState(): Promise<void> {
    this.isAuthenticated.set(await this.authService.isAuthenticated());
    if (this.isAuthenticated()) {
      this.userProfile.set(await this.authService.getUserProfile());
      this.isAdmin.set(await this.authService.isAdmin());
      this.isUser.set(await this.authService.isUser());
    } else {
      this.userProfile.set(null);
      this.isAdmin.set(false);
      this.isUser.set(false);
    }
  }

  async login() {
    await this.authService.login();
  }

  async logout(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    try {
      await this.authService.logout();
      // The logout will redirect to Keycloak, so we don't need to update state here
    } catch (error) {
      // Handle logout error if needed
    }
  }
}
