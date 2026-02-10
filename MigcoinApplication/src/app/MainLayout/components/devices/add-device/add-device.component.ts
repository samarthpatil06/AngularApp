import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-device',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-device.component.html',
  styleUrl: './add-device.component.scss'
})
export class AddDeviceComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

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

  // 🔥 Dropdown options for channels (1-8)
  readonly CHANNEL_OPTIONS: number[] = [1, 2, 3, 4, 5, 6, 7, 8];

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
    macId: '',
    locationId: ''
  };

  // 🔥 NEW: User information for email
  currentUser: any = null;

  ngOnInit(): void {
    this.updateChannels();
    this.loadCurrentUser();
  }

  // 🔥 NEW: Load current logged-in user information
  loadCurrentUser(): void {
    // Get user from localStorage (adjust based on your auth implementation)
    const userStr = localStorage.getItem('currentUser') || localStorage.getItem('user');
    if (userStr) {
      try {
        this.currentUser = JSON.parse(userStr);
        console.log('Current user loaded:', this.currentUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  updateChannels(): void {
    // Rebuild channels array
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
    // Basic validation
    if (!this.device.modelCode.trim()) {
      alert('⚠️ Please enter Model Code');
      return;
    }

    if (!this.device.modelName.trim()) {
      alert('⚠️ Please enter Model Name');
      return;
    }

    // Channel validation
    for (const ch of this.device.channels) {
      if (!ch.unit) {
        alert(`⚠️ Please select a unit for Channel ${ch.channelNo}`);
        return;
      }
      if (!this.ALLOWED_UNITS.includes(ch.unit)) {
        alert(`Invalid unit selected: ${ch.unit}`);
        return;
      }
      if (ch.rangeLow === null || ch.rangeHigh === null) {
        alert(`⚠️ Please enter range values for Channel ${ch.channelNo}`);
        return;
      }
      if (ch.rangeLow >= ch.rangeHigh) {
        alert(`⚠️ Min range must be less than Max range for Channel ${ch.channelNo}`);
        return;
      }
    }

    // 🔥 NEW: Include user information in payload
    const payload = {
      modelCode: this.device.modelCode,
      modelName: this.device.modelName,
      numberOfChannels: this.device.numberOfChannels,
      channels: this.device.channels,
      // Add user information for email notification
      userEmail: this.currentUser?.email || '',
      userName: this.currentUser?.firstName
        ? `${this.currentUser.firstName} ${this.currentUser.lastName || ''}`.trim()
        : 'User'
    };

    console.log('Submitting device with user info:', payload);

    this.save.emit(payload);
  }

  cancel(): void {
    this.close.emit();
  }
}