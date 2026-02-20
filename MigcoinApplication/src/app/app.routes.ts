import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./forgot-password/forgot-password.component')
        .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () =>
      import('./reset-password/reset-password.component')
        .then(m => m.ResetPasswordComponent)
  },
  {
    path: 'activate-account',
    loadComponent: () =>
      import('./MainLayout/components/activate-account/activate-account.component')
        .then(m => m.ActivateAccountComponent)
  },
  {
    path: 'activate-device',
    loadComponent: () =>
      import('./MainLayout/components/activate-device/activate-device.component')
        .then(m => m.ActivateDeviceComponent)
  },
  {
    path: '',
    loadComponent: () =>
      import('./MainLayout/main-layout.component')
        .then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'dashboard',
        data: { title: 'Dashboard' },
        loadComponent: () =>
          import('./MainLayout/components/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },
      {
        path: 'view',
        data: { title: 'View' },
        loadComponent: () =>
          import('./MainLayout/components/view/view.component')
            .then(m => m.ViewComponent)
      },
      {
        path: 'devices',
        data: { title: 'Manage Devices' },
        loadComponent: () =>
          import('./MainLayout/components/devices/devices.component')
            .then(m => m.DevicesComponent)
      },
      {
        path: 'accounts',
        data: { title: 'Manage Account' },
        loadComponent: () =>
          import('./MainLayout/components/accounts/accounts.component')
            .then(m => m.AccountsComponent)
      },
      {
        path: 'settings',
        data: { title: 'Settings' },
        loadComponent: () =>
          import('./MainLayout/components/settings/settings.component')
            .then(m => m.SettingsComponent)
      },
      {
        path: 'help',
        data: { title: 'Help' },
        loadComponent: () =>
          import('./MainLayout/components/help/help.component')
            .then(m => m.HelpComponent)
      },
      {
        path: 'device-list',
        data: { title: 'Device Models List' },
        loadComponent: () =>
          import('./device-list/device-list.component')
            .then(m => m.DeviceListComponent)
      }
    ]
  }
];
