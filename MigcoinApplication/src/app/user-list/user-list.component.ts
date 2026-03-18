import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngFor
import { DeviceModelService } from '../services/device-model.service';

@Component({
    selector: 'app-device-list',
    standalone: true, // Mark as standalone
    imports: [CommonModule], // Import CommonModule here
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.scss'] // Remove if you don't have a CSS file
})
export class DeviceListComponent implements OnInit {

    deviceModels: any[] = [];

    constructor(private deviceModelService: DeviceModelService) { }

    ngOnInit(): void {
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
}