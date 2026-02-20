import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  settings = [
    {
      title: 'Profile Settings',
      description: 'Manage admin profile details and account preferences.'
    },
    {
      title: 'Notification Settings',
      description: 'Configure email and in-app notification behavior.'
    },
    {
      title: 'Security Settings',
      description: 'Update password policy, sessions, and access controls.'
    },
    {
      title: 'System Preferences',
      description: 'Adjust application defaults for your workspace.'
    }
  ];
}
