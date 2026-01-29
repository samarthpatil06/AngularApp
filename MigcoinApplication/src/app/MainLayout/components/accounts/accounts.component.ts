// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AddUserComponent } from './add-user/add-user.component';
// import { AuthService } from '../../../services/auth.service'; // Import AuthService

// @Component({
//   selector: 'app-accounts',
//   standalone: true,
//   imports: [CommonModule, AddUserComponent],
//   templateUrl: './accounts.component.html',
//   styleUrl: './accounts.component.scss'
// })
// export class AccountsComponent implements OnInit {

//   adminEmail = 'abc@gmail.com';
//   users: any[] = []; // We use 'any' because DB structure might vary
//   showAddUser = false;

//   constructor(private authService: AuthService) { }

//   ngOnInit(): void {
//     this.fetchUsers();
//   }

//   fetchUsers() {
//     this.authService.getAllUsers().subscribe({
//       next: (data) => {
//         console.log('Fetched users:', data);
//         this.users = data;
//       },
//       error: (err) => {
//         console.error('Failed to fetch users', err);
//       }
//     });
//   }

//   openAddUser(): void {
//     this.showAddUser = true;
//   }

//   closeAddUser(): void {
//     this.showAddUser = false;
//   }

//   // Note: This just updates the list locally for now. 
//   // You would need a separate API call to actually "Add" a user to DB.
//   addUser(user: any): void {
//     this.users.push(user);
//     this.closeAddUser();
//   }
// }



// // Revised Code Below samarth file
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AddUserComponent } from './add-user/add-user.component';
// export interface User {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   role: 'Admin' | 'User';
//   active: boolean;

// }



// @Component({
//   selector: 'app-accounts',
//   standalone: true,
//   imports: [CommonModule, AddUserComponent],
//   templateUrl: './accounts.component.html',
//   styleUrl: './accounts.component.scss'
// })

// export class AccountsComponent {

//   adminEmail = 'abc@gmail.com';





//   users: User[] = [

//     {

//       firstName: 'Amul',

//       lastName: '',

//       email: 'amul@gmail.com',

//       phone: '9898989898',

//       role: 'Admin',

//       active: true

//     },

//     {

//       firstName: 'Nandini',

//       lastName: '',

//       email: 'nandini@gmail.com',

//       phone: '9898989898',

//       role: 'Admin',

//       active: true

//     },

//     {

//       firstName: 'Warana',

//       lastName: '',

//       email: 'warana@gmail.com',

//       phone: '9898989898',

//       role: 'Admin',

//       active: true

//     }

//   ];



//   showAddUser = false;



//   openAddUser(): void {

//     this.showAddUser = true;

//   }



//   closeAddUser(): void {

//     this.showAddUser = false;

//   }



//   addUser(user: User): void {

//     this.users.push(user);

//     this.closeAddUser();

//   }
// }



import { Component, OnInit } from '@angular/core'; // 1. Import OnInit
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
// Check this path matches your folder structure
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, AddUserComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})

export class AccountsComponent implements OnInit {

  users: any[] = [];
  showAddUser = false;

  constructor(private UserService: UserService) { }

  // 3. Add this method (this loads data when page opens)
  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.UserService.getUsers().subscribe({
      next: (data) => {
        console.log('Fetched Users:', data);
        this.users = data;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
      }
    });
  }

  openAddUser(): void {
    this.showAddUser = true;
  }

  closeAddUser(): void {
    this.showAddUser = false;
  }

  addUser(user: any): void {
    this.UserService.addUser(user).subscribe({
      next: (res) => {
        console.log('User saved:', res);
        this.fetchUsers();
        this.closeAddUser();
      },
      error: (err) => {
        console.error('Failed to save device model', err);
        alert('Failed to add user');
      }
    })
  }
}





