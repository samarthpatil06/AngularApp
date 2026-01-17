import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-device',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-device.component.html',
  styleUrl: './add-device.component.scss'
})
export class AddDeviceComponent {

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  // 🔒 Backend-aligned unit contract (DO NOT CHANGE casually)
  readonly ALLOWED_UNITS: string[] = [
    '°C',
    'V/mV',
    'mA/A',
    'mbar',
    'Lux',
    'UL',
    'ppm',
    'bar',
    'pH',
    'uSiemens/mSiemens',
    'cm/m'
  ];

  // Backend-aligned DeviceModel structure
  device = {
    modelCode: '',
    modelName: '',
    numberOfChannels: 1,
    channels: [] as {
      channelNo: number;
      rangeLow: number | null;
      rangeHigh: number | null;
      unit: string;
    }[],

    // UI-only (future use)
    macId: '',
    locationId: ''
  };

  updateChannels(): void {
    this.device.channels = [];

    for (let i = 1; i <= this.device.numberOfChannels; i++) {
      this.device.channels.push({
        channelNo: i,
        rangeLow: null,
        rangeHigh: null,
        unit: ''
      });
    }
  }

  submit(): void {
    // 🛡 sanity guard (peace of mind)
    for (const ch of this.device.channels) {
      if (!this.ALLOWED_UNITS.includes(ch.unit)) {
        alert(`Invalid unit selected: ${ch.unit}`);
        return;
      }
    }

    const payload = {
      modelCode: this.device.modelCode,
      modelName: this.device.modelName,
      numberOfChannels: this.device.numberOfChannels,
      channels: this.device.channels
    };

    this.save.emit(payload);
  }

  cancel(): void {
    this.close.emit();
  }
}
