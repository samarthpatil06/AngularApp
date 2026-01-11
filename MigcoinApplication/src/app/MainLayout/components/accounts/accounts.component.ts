import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Admin' | 'User';
  active: boolean;
}

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, AddUserComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
  adminEmail = 'abc@gmail.com';


  users: User[] = [
    {
      firstName: 'Amul',
      lastName: '',
      email: 'amul@gmail.com',
      phone: '9898989898',
      role: 'Admin',
      active: true
    },
    {
      firstName: 'Nandini',
      lastName: '',
      email: 'nandini@gmail.com',
      phone: '9898989898',
      role: 'Admin',
      active: true
    },
    {
      firstName: 'Warana',
      lastName: '',
      email: 'warana@gmail.com',
      phone: '9898989898',
      role: 'Admin',
      active: true
    }
  ];

  showAddUser = false;

  openAddUser(): void {
    this.showAddUser = true;
  }

  closeAddUser(): void {
    this.showAddUser = false;
  }

  addUser(user: User): void {
    this.users.push(user);
    this.closeAddUser();
  }
}
