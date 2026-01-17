import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDeviceComponent } from './add-device/add-device.component';
import { DeviceModelService } from '../../../services/device-model.service';


@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, AddDeviceComponent],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent {

  // This now correctly represents Device MODELS
  deviceModels: any[] = [];

  showAddModal = false;

  constructor(private deviceModelService: DeviceModelService) {}

  openAddDevice(): void {
    this.showAddModal = true;
  }

  closeAddDevice(): void {
    this.showAddModal = false;
  }

  // Called when AddDeviceComponent emits SAVE
  addDevice(deviceModel: any): void {
    this.deviceModelService.addDeviceModel(deviceModel).subscribe({
      next: (res) => {
        console.log('Device model saved:', res);

        // 🔹 Visual feedback in frontend
        this.deviceModels.push(res.data);

        this.closeAddDevice();
      },
      error: (err) => {
        console.error('Failed to save device model', err);
        alert('Failed to add device model');
      }
    });
  }
}
