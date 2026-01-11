import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../MainLayout/header/header.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,HeaderComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder,private authService:AuthService, private router:Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.authService.login(this.loginForm.value as any)
      .subscribe({
        next: (res) => {
          this.authService.saveUser(res);

          if (res.role === 'SUPERUSER') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/view']);
          }
        },
        error: () => {
          alert('Invalid credentials');
        }
      });
  }

  get f() {
    return this.loginForm.controls;
  }
}
