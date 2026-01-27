import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './MainLayout/header/header.component';
// 1. IMPORT THE NEW COMPONENT
import { DeviceListComponent } from './device-list/device-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. ADD IT TO THIS LIST
  imports: [RouterOutlet, LoginComponent, HeaderComponent, DeviceListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MigcoinApplication';
}