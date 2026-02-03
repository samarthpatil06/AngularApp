import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
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

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.UserService.getUsers().subscribe({
      next: (data) => {
        console.log('Fetched Users:', data);
        this.users = data.map((user: any) => ({
          ...user,
          fullName: `${user.firstName} ${user.lastName || ''}`.trim()
        }));
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
    console.log('📤 About to send user data:', user); // Log BEFORE sending

    this.UserService.addUser(user).subscribe({
      next: (res) => {
        console.log('✅ User saved:', res);
        this.fetchUsers();
        this.closeAddUser();
      },
      error: (err) => {
        console.error('❌ Failed to add user', err);
        alert(`Failed to add user: ${err.error?.message || err.message}`);
      }
    });
  }
}





