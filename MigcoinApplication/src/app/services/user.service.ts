import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    // Make sure this matches your backend URL exactly
    private apiUrl = 'http://localhost:3000/api/users';

    constructor(private http: HttpClient) { }

    // 1. Existing method
    addUser(payload: any): Observable<any> {
        return this.http.post(this.apiUrl, payload);
    }

    // 2. NEW METHOD (Add this!)
    getUsers(): Observable<any> {
        return this.http.get<any[]>('http://localhost:3000/api/users');
    }
}