import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceModelService } from '../../../services/device-model.service';

@Component({
  selector: 'app-device-models',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.scss'
})
export class DeviceModelsComponent implements OnInit {

  deviceModels: any[] = [];

  constructor(private deviceModelService: DeviceModelService) {}

  ngOnInit(): void {
    this.fetchDeviceModels();
  }

  fetchDeviceModels() {
    this.deviceModelService.getDeviceModels().subscribe({
      next: (data) => {
        this.deviceModels = data;
      },
      error: (err) => {
        console.error('Failed to fetch device models', err);
      }
    });
  }
}
