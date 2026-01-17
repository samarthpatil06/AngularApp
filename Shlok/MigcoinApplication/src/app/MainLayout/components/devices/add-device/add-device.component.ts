import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Device, Channel } from '../devices.component';

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
    locationId: '',
    channelCount: 1,
    channels: []
  };

  parameters = [
    { name: 'Temperature', unit: '°C' },
    { name: 'Pressure', unit: 'bar' },
    { name: 'Voltage', unit: 'V' },
    { name: 'Current', unit: 'A' }
  ];

  updateChannels(): void {
    this.device.channels = [];
    for (let i = 1; i <= (this.device.channelCount || 1); i++) {
      this.device.channels.push({
        channelNo: i,
        parameter: '',
        minRange: null,
        maxRange: null,
        unit: ''
      });
    }
  }

  onParameterChange(channel: Channel): void {
    const param = this.parameters.find(p => p.name === channel.parameter);
    channel.unit = param ? param.unit : '';
  }

  submit(): void {
    this.save.emit({ ...this.device });
  }
}
