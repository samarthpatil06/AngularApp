import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { UserService } from '../../../services/user.service';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  isActive: boolean;
}

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, AddUserComponent],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']   // ⚠️ plural
})
export class AccountsComponent implements OnInit {

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
        console.log('Users loaded:', data);
      },

      error: (err) => {
        console.error('Error:', err);
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
