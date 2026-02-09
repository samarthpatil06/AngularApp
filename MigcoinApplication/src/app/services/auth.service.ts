import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // private apiUrl = '/api';  //For Docker
  private apiUrl = `${environment.apiUrl}`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  login(credentials: { email: string; password: string }) {
    return this.http.post<any>(`${this.apiUrl}/superuser/login`, credentials);
  }


  saveUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  isSuperUser(): boolean {
    return this.getUser().role === 'SUPERUSER';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
