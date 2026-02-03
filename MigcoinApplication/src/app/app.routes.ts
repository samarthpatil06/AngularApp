import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./login/login.component')
        .then(m => m.LoginComponent)
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
            .then(m => m.DeviceModelsComponent)
      },
      {
        path: 'accounts',
        data: { title: 'Manage Account' },
        loadComponent: ()=>
          import('./MainLayout/components/accounts/accounts.component')
           .then(m => m.AccountsComponent)
      }
    ]
  }
];
