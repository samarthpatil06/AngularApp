// environment.prod.ts — FIXED
export const environment = {
  production: true,   // ✅ Must be true
  apiUrl: `http://${window.location.hostname}:3000/api`
};