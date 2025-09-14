import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserInfoComponent } from '../user-info/user-info.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, UserInfoComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  private readonly authService = inject(AuthService);

  // Static data for settings
  userProfile = {
    name: 'Admin User',
    email: 'admin@inventory.com',
    role: 'Administrator',
    lastLogin: '2024-01-15 10:30 AM',
  };

  systemSettings = {
    lowStockThreshold: 10,
    autoReorder: true,
    emailNotifications: true,
    darkMode: false,
    language: 'English',
    timezone: 'UTC-5',
  };

  categories = [
    { name: 'Electronics', count: 45, active: true },
    { name: 'Computers', count: 32, active: true },
    { name: 'Mobile Phones', count: 28, active: true },
    { name: 'Accessories', count: 25, active: true },
    { name: 'Gaming', count: 18, active: false },
    { name: 'Home & Garden', count: 15, active: false },
  ];

  users = [
    {
      name: 'John Doe',
      email: 'john@company.com',
      role: 'Manager',
      status: 'Active',
    },
    {
      name: 'Jane Smith',
      email: 'jane@company.com',
      role: 'Employee',
      status: 'Active',
    },
    {
      name: 'Mike Johnson',
      email: 'mike@company.com',
      role: 'Employee',
      status: 'Inactive',
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      role: 'Admin',
      status: 'Active',
    },
  ];

  saveSettings() {
    // Simulate saving settings
  }

  addCategory() {
    // Simulate adding category
  }

  addUser() {
    // Simulate adding user
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
