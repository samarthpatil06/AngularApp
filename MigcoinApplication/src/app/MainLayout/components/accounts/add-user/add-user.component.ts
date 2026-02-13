import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for API calls

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Admin' | 'User';
  password: string;
  isActive: boolean;
  plan: string; // Subscription plan (basic, pro, premium)
}

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  password: string = '';
  confirmPassword: string = '';

  @Output() save = new EventEmitter<User>();
  @Output() close = new EventEmitter<void>();

  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'User',
    password: '',
    isActive: false,  // Will be activated via email
    plan: ''  // Subscription plan (basic, pro, premium)
  };

  onSave(): void {
    console.log('Before validation:', this.user);

    // Validate password
    if (!this.password || !this.confirmPassword) {
      alert('Please enter password');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Validate required fields
    if (!this.user.firstName || !this.user.email) {
      alert('Please fill in all required fields (First Name and Email)');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.user.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Add password to user object
    this.user.password = this.password;
    this.user.isActive = false;  // User must activate via email

    console.log('Sending to backend:', this.user);

    this.save.emit(this.user);
    // Don't reset form here - let parent component handle it after success
  }

  onCancel(): void {
    this.close.emit();
    this.resetForm();
  }

  resetForm(): void {
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'User',
      password: '',
      isActive: false,
      plan: ''
    };
    this.password = '';
    this.confirmPassword = '';
  }
}