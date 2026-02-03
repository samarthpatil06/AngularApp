// This file can be replaced during build by using the `fileReplacements` array when uploading to AWS. when uploading to AWS I used 
// below environment file to point to the correct API URL.

// export const environment = {
//   production: true,
//   apiUrl: 'http://localhost:3000/api' // Note: In Docker, this usually stays localhost:3000 because the BROWSER is accessing it.
// };

export const environment = {
  production: true,
  apiUrl: '/api'  // Note: No http://, no IP, no Port! 
};