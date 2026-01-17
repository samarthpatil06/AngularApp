import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddDeviceComponent } from './add-device/add-device.component';

export interface Channel {
  channelNo: number;
  parameter: string;
  minRange: number | null;
  maxRange: number | null;
  unit: string;
}

export interface Device {
  macId: string;
  name: string;
  group: string;
  deviceId: string;
  locationId: string;
  channelCount?: number;
  channels?: Channel[];
}

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, AddDeviceComponent],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DevicesComponent {

  devices: Device[] = [];
  showAddModal = false;

  openAddDevice(): void {
    this.showAddModal = true;
  }

  closeAddDevice(): void {
    this.showAddModal = false;
  }

  addDevice(device: Device): void {
    this.devices.push(device);
    this.closeAddDevice();
  }
}
