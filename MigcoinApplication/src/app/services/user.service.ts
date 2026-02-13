import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // private apiUrl = '/api';  //For Docker
  private apiUrl = `${environment.apiUrl}/users`; // Correct URL for Local

  constructor(private http: HttpClient) { }

  getUsers(search?: string): Observable<any> {
    let url = this.apiUrl;
    if (search) {
      url += `?search=${search}`;
    }
    return this.http.get<any>(url);
  }

  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }
}