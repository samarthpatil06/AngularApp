import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Device } from '../devices.component';

@Component({
  selector: 'app-add-device',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-device.component.html',
  styleUrl: './add-device.component.scss'
})
export class AddDeviceComponent {

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Device>();

  device: Device = {
    macId: '',
    name: '',
    group: '',
    deviceId: '',
    locationId: ''
  };

  submit(): void {
    this.save.emit({ ...this.device });
  }
}
