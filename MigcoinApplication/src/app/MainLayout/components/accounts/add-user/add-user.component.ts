import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}


  // ================= USER MODEL =================
  user: any = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    plan: '',
    licenseKey: '',
    password: '',
    isActive: true
  };

  confirmPassword: string = '';


  // ================= GENERATE LICENSE KEY =================
  generateKey() {

    let key = '';

    for (let i = 0; i < 16; i++) {
      key += Math.floor(Math.random() * 10);
    }

    this.user.licenseKey = key;
  }


  // ================= RESET FORM =================
  reset() {

    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      plan: '',
      licenseKey: '',
      password: '',
      isActive: true
    };

    this.confirmPassword = '';
  }


  // ================= SUBMIT =================
  submit(): void {

    if (!this.user.firstName || !this.user.email) {
      alert('Name and Email required');
      return;
    }

    if (!this.user.plan) {
      alert('Select Subscription Plan');
      return;
    }

    if (!this.user.licenseKey) {
      alert('Generate License Key');
      return;
    }

    if (!this.user.password || this.user.password !== this.confirmPassword) {
      alert('Password mismatch');
      return;
    }


    // ✅ Get admin email
    const adminEmail = localStorage.getItem('email');

    if (!adminEmail) {
      alert('Please login again');
      return;
    }


    // ✅ Send to backend with header
    this.http.post(
      'http://localhost:3000/api/users',
      this.user,
      {
        headers: {
          email: adminEmail
        }
      }
    ).subscribe({

      next: () => {

        alert('User created successfully');

        this.save.emit();
        this.close.emit();

        // ✅ Clear form
        this.reset();

      },

      error: (err) => {

        console.error(err);

        alert(err.error?.message || 'Failed to create user');

      }

    });

  }

}