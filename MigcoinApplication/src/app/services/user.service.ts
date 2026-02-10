import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:3000/api/users';
  private superApi = 'http://localhost:3000/api/super';


  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<any[]>(this.apiUrl);
  }

  createUser(user: any) {
    return this.http.post(this.apiUrl, user);
  }



  createUserBySuperAdmin(data: any) {
    return this.http.post(`${this.superApi}/create-user`, data);
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  changePassword(payload: any) {
    return this.http.post(`${this.apiUrl}/user/change-password`, payload);
  }
}

