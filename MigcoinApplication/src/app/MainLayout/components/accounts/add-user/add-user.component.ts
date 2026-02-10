import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  user = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'User',
    subscriptionPlan: '3m'
  };

  loading = false;
  error = '';
  showSuccessModal = false;
  createdUserEmail = '';
  createdUserPassword = '';

  constructor(private userService: UserService) {}

  submit(): void {
    this.error = '';
    this.loading = true;

    console.log('=== CREATING NEW USER ===');
    console.log('Username (Email):', this.user.email);
    console.log('First Name:', this.user.firstName);
    console.log('Last Name:', this.user.lastName);
    console.log('Phone:', this.user.phone);
    console.log('Role:', this.user.role);
    console.log('Subscription Plan:', this.user.subscriptionPlan);
    console.log('Sending user creation request...');

    this.userService.createUserBySuperAdmin(this.user).subscribe({
      next: (response: any) => {
        this.loading = false;
        
        this.createdUserEmail = this.user.email;
        this.createdUserPassword = response.tempPassword;
        
        this.showSuccessModal = true;
        
        console.log('=== USER CREATION SUCCESSFUL ===');
        console.log('Response Message:', response.message);
        console.log('Email Sent Successfully:', response.message.includes('Credentials sent to email'));
        console.log('Temporary Password Generated:', !!response.tempPassword);
        console.log('Subscription Key:', response.subscriptionKey);
        console.log('Full Response:', response);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to create user';
        
        console.error('=== USER CREATION FAILED ===');
        console.error('Error Message:', this.error);
        console.error('Status Code:', err.status);
        console.error('Full Error:', err);
        console.error('Email that failed:', this.user.email);
      }
    });
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.resetForm();
    this.save.emit();
    this.close.emit();
  }

  resetForm(): void {
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'User',
      subscriptionPlan: '3m'
    };
    this.error = '';
    this.createdUserEmail = '';
    this.createdUserPassword = '';
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy');
    });
  }
}