import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  saveUser(res: any) {
  localStorage.setItem('token', res.token);
  localStorage.setItem('user', JSON.stringify({
    email: res.email,
    role: res.role
  }));
}


  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  isSuperUser(): boolean {
    return this.getUser().role === 'SuperAdmin';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
