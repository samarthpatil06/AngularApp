import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Admin' | 'User';
  password: string;
  isActive: boolean;  // Changed from 'active' to 'isActive'
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
    isActive: true  // Changed from 'active' to 'isActive'
  };

  onSave(): void {
    console.log('Before validation:', this.user); // Debug

    if (!this.password || !this.confirmPassword) {
      alert('Please enter password');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (!this.user.firstName || !this.user.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Add password to user object
    this.user.password = this.password;

    console.log('Sending to backend:', this.user); // Debug

    this.save.emit(this.user);
    this.resetForm();
  }

  onCancel(): void {
    this.close.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'User',
      password: '',
      isActive: true  // Changed from 'active' to 'isActive'
    };
    this.password = '';
    this.confirmPassword = '';
  }
}