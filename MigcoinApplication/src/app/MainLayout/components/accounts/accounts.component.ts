import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { UserService } from '../../../services/user.service';



export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Admin' | 'User' | 'SuperAdmin';
  isActive: boolean;
}

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, AddUserComponent],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent implements OnInit {

  adminEmail = 'abc@gmail.com';

  users: User[] = [];

  showAddUser = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe({
  next: (data: User[]) => {
    this.users = data;
  },
  error: (err: any) => {
    console.error(err);
  }
});

  }

  openAddUser(): void {
    this.showAddUser = true;
  }

  closeAddUser(): void {
    this.showAddUser = false;
  }

  addUser(): void {
    this.fetchUsers();
    this.closeAddUser();
  }
}
