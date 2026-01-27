import { Component, OnInit } from '@angular/core'; // 1. Import OnInit
import { CommonModule } from '@angular/common';
import { AddDeviceComponent } from './add-device/add-device.component';
// Check this path matches your folder structure
import { DeviceModelService } from '../../../services/device-model.service';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, AddDeviceComponent],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
// 2. Implement OnInit here
export class DevicesComponent implements OnInit {

  deviceModels: any[] = [];
  showAddModal = false;

  constructor(private deviceModelService: DeviceModelService) { }

  // 3. ADD THIS METHOD (This loads data when page opens)
  ngOnInit(): void {
    this.fetchDeviceModels();
  }

  fetchDeviceModels(): void {
    this.deviceModelService.getDeviceModels().subscribe({
      next: (data) => {
        console.log('Fetched devices:', data);
        this.deviceModels = data;
      },
      error: (err) => {
        console.error('Error fetching devices:', err);
      }
    });
  }

  openAddDevice(): void {
    this.showAddModal = true;
  }

  closeAddDevice(): void {
    this.showAddModal = false;
  }

  addDevice(deviceModel: any): void {
    this.deviceModelService.addDeviceModel(deviceModel).subscribe({
      next: (res) => {
        console.log('Device model saved:', res);

        // Option A: Add directly to list (fastest)
        // this.deviceModels.push(res.data);

        // Option B: Reload from server (safest)
        this.fetchDeviceModels();

        this.closeAddDevice();
      },
      error: (err) => {
        console.error('Failed to save device model', err);
        alert('Failed to add device model');
      }
    });
  }
}