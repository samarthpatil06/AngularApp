import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(() => {
    registerServiceWorker();
  })
  .catch((err) => console.error(err));

function registerServiceWorker(): void {
  if (!('serviceWorker' in navigator)) {
    console.log('Service worker is not supported in this browser.');
    return;
  }

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered:', registration.scope);

      if (registration.waiting) {
        notifyUpdate(registration);
      }

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) {
          return;
        }

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            notifyUpdate(registration);
          }
        });
      });
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

function notifyUpdate(registration: ServiceWorkerRegistration): void {
  const shouldRefresh = window.confirm('A new version is available. Update now?');
  if (!shouldRefresh) {
    return;
  }

  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  } else {
    window.location.reload();
  }
}
