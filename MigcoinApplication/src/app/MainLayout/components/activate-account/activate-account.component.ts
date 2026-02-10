import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="activation-container">
      <div class="activation-card">
        
        <!-- Loading State -->
        <div *ngIf="isLoading" class="status-content">
          <div class="spinner"></div>
          <h2>Activating Your Account...</h2>
          <p>Please wait while we verify your account.</p>
        </div>

        <!-- Success State -->
        <div *ngIf="!isLoading && isSuccess" class="status-content success">
          <div class="icon-circle success-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h2>Account Activated!</h2>
          <p>Your account has been successfully activated.</p>
          <p class="user-email">{{ userEmail }}</p>
          
          <div class="action-buttons">
            <button class="btn btn-primary" (click)="goToLogin()">
              Go to Login
            </button>
          </div>

          <p class="redirect-info">Redirecting to login in {{ countdown }} seconds...</p>
        </div>

        <!-- Already Activated State -->
        <div *ngIf="!isLoading && alreadyActivated" class="status-content warning">
          <div class="icon-circle warning-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h2>Already Activated</h2>
          <p>This account has already been activated.</p>
          <p class="user-email">{{ userEmail }}</p>
          
          <div class="action-buttons">
            <button class="btn btn-primary" (click)="goToLogin()">
              Go to Login
            </button>
          </div>
        </div>

        <!-- Error State -->
        <div *ngIf="!isLoading && isError" class="status-content error">
          <div class="icon-circle error-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <h2>Activation Failed</h2>
          <p>{{ errorMessage }}</p>
          
          <div class="action-buttons">
            <button class="btn btn-secondary" (click)="resendEmail()">
              Resend Activation Email
            </button>
            <button class="btn btn-text" (click)="goToLogin()">
              Go to Login
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
      border-top: 4px solid #667eea;
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

    .user-email {
      font-weight: bold;
      color: #667eea;
      margin-top: 15px !important;
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-secondary:hover {
      background: #667eea;
      color: white;
    }

    .btn-text {
      background: transparent;
      color: #666;
    }

    .btn-text:hover {
      color: #667eea;
    }

    .redirect-info {
      margin-top: 20px;
      font-size: 14px;
      color: #999;
    }
  `]
})
export class ActivateAccountComponent implements OnInit {
  isLoading = true;
  isSuccess = false;
  isError = false;
  alreadyActivated = false;
  errorMessage = '';
  userEmail = '';
  countdown = 5;

  private apiUrl = 'http://localhost:3000/api'; // Change to your API URL

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Get token and email from URL
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      const email = params['email'];

      if (token && email) {
        this.userEmail = email;
        this.activateAccount(token, email);
      } else {
        this.isLoading = false;
        this.isError = true;
        this.errorMessage = 'Invalid activation link. Missing token or email.';
      }
    });
  }

  activateAccount(token: string, email: string): void {
    this.http.post(`${this.apiUrl}/users/activate`, { token, email })
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          if (response.alreadyActivated) {
            this.alreadyActivated = true;
          } else {
            this.isSuccess = true;
            this.startCountdown();
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.isError = true;
          this.errorMessage = error.error?.message || 'Failed to activate account. The link may be expired or invalid.';
        }
      });
  }

  startCountdown(): void {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.goToLogin();
      }
    }, 1000);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  resendEmail(): void {
    this.http.post(`${this.apiUrl}/users/resend-verification`, { email: this.userEmail })
      .subscribe({
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