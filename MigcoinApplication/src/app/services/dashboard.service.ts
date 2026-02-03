import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) {}

  getSummary() {
    return this.http.get<any>('http://localhost:3000/api/dashboard/summary');
  }
}
