import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
})
export class LandingComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signals for reactive state management
  isAuthenticated = signal(false);

  async ngOnInit(): Promise<void> {
    this.isAuthenticated.set(await this.authService.isAuthenticated());
  }

  async login(): Promise<void> {
    await this.authService.login();
  }

  goToDashboard(): void {
    if (this.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.login();
    }
  }
}
