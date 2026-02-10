import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceModelService {

  private apiUrl = 'http://localhost:3000/api/device-models';

  constructor(private http: HttpClient) {}

  addDeviceModel(payload: any): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
  getDeviceModels() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
