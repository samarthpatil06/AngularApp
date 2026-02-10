import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-activate-device',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="activation-container">
      <div class="activation-card">
        
        <!-- Loading State -->
        <div *ngIf="isLoading" class="status-content">
          <div class="spinner"></div>
          <h2>Activating Your Device...</h2>
          <p>Please wait while we activate your device.</p>
        </div>

        <!-- Success State -->
        <div *ngIf="!isLoading && isSuccess" class="status-content success">
          <div class="icon-circle success-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2>Device Activated!</h2>
          <p>Your device has been successfully activated and is ready to use.</p>
          <p class="device-info">{{ deviceInfo }}</p>
          
          <div class="action-buttons">
            <button class="btn btn-primary" (click)="goToDashboard()">
              Go to Dashboard
            </button>
            <button class="btn btn-secondary" (click)="goToDevices()">
              View All Devices
            </button>
          </div>
        </div>

        <!-- Already Activated State -->
        <div *ngIf="!isLoading && alreadyActivated" class="status-content warning">
          <div class="icon-circle warning-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <h2>Already Activated</h2>
          <p>This device has already been activated.</p>
          <p class="device-info">{{ deviceId }}</p>
          
          <div class="action-buttons">
            <button class="btn btn-primary" (click)="goToDevices()">
              View Devices
            </button>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="!isLoading && isError" class="status-content error">
          <div class="icon-circle error-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2>Activation Failed</h2>
          <p>{{ errorMessage }}</p>
          
          <div class="action-buttons">
            <button class="btn btn-secondary" (click)="resendEmail()">
              Resend Activation Email
            </button>
            <button class="btn btn-text" (click)="goToDashboard()">
              Go to Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .activation-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      padding: 20px;
    }

    .activation-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 100%;
      padding: 40px;
      text-align: center;
    }

    .status-content h2 {
      color: #333;
      margin: 20px 0 10px;
      font-size: 28px;
    }

    .status-content p {
      color: #666;
      margin: 10px 0;
      font-size: 16px;
    }

    .spinner {
      border: 4px solid #f3f3f3;
      border-top: 4px solid #2196F3;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .icon-circle {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .success-icon {
      background-color: #d4edda;
      color: #28a745;
    }

    .warning-icon {
      background-color: #fff3cd;
      color: #ffc107;
    }

    .error-icon {
      background-color: #f8d7da;
      color: #dc3545;
    }

    .device-info {
      font-weight: bold;
      color: #2196F3;
      margin-top: 15px !important;
      padding: 10px;
      background-color: #e3f2fd;
      border-radius: 5px;
    }

    .action-buttons {
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .btn {
      padding: 12px 30px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-primary {
      background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(33, 150, 243, 0.4);
    }

    .btn-secondary {
      background: white;
      color: #2196F3;
      border: 2px solid #2196F3;
    }

    .btn-secondary:hover {
      background: #2196F3;
      color: white;
    }

    .btn-text {
      background: transparent;
      color: #666;
    }

    .btn-text:hover {
      color: #2196F3;
    }
  `]
})
export class ActivateDeviceComponent implements OnInit {
  isLoading = true;
  isSuccess = false;
  isError = false;
  alreadyActivated = false;
  errorMessage = '';
  deviceId = '';
  deviceInfo = '';
  userEmail = '';

  private apiUrl = 'http://localhost:3000/api'; // Change to your API URL

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get token and deviceId from URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const deviceId = params['deviceId'];

      if (token && deviceId) {
        this.deviceId = deviceId;
        // Get user email from localStorage
        const userStr = localStorage.getItem('currentUser') || localStorage.getItem('user');
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            this.userEmail = user.email;
          } catch (e) {
            console.error('Error parsing user data');
          }
        }
        this.activateDevice(token, deviceId);
      } else {
        this.isLoading = false;
        this.isError = true;
        this.errorMessage = 'Invalid activation link. Missing token or device ID.';
      }
    });
  }

  activateDevice(token: string, deviceId: string): void {
    this.http.post(`${this.apiUrl}/devices/activate`, { token, deviceId })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          if (response.alreadyActivated) {
            this.alreadyActivated = true;
          } else {
            this.isSuccess = true;
            this.deviceInfo = `${response.data?.modelName} (${response.data?.modelCode})`;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.isError = true;
          this.errorMessage = error.error?.message || 'Failed to activate device. The link may be expired or invalid.';
        }
      });
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  goToDevices(): void {
    this.router.navigate(['/devices']);
  }

  resendEmail(): void {
    if (!this.userEmail) {
      alert('❌ Unable to resend email. Please login and try again.');
      return;
    }

    this.http.post(`${this.apiUrl}/devices/resend-activation`, { 
      deviceId: this.deviceId,
      userEmail: this.userEmail 
    }).subscribe({
      next: (response: any) => {
        alert('✅ Activation email has been resent! Please check your inbox.');
        this.isError = false;
        this.isLoading = false;
      },
      error: (error) => {
        alert('❌ Failed to resend email. Please try again later.');
      }
    });
  }
}