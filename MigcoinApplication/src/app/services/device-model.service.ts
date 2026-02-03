import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceModelService {

  // Make sure this matches your backend URL exactly
  // private apiUrl = '/api/device-models';  //For Docker
  private apiUrl = 'http://localhost:3000/api/device-models';

  constructor(private http: HttpClient) { }

  // 1. Existing method
  addDeviceModel(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  // 2. NEW METHOD (Add this!)
  getDeviceModels(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }
}