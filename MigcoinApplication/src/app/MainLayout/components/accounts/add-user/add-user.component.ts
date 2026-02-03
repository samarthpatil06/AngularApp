import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  user = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'User',
    password: '',
    isActive: true
  };

  confirmPassword = '';

  constructor(private userService: UserService) {}

  submit(): void {

    if (!this.user.password || this.user.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.userService.createUser(this.user).subscribe({
      next: (res: any) => {
        console.log('USER CREATED SUCCESSFULLY', res);
        this.save.emit();
        this.close.emit();
      },
      error: (err: any) => {
        console.error('FAILED TO CREATE USER', err);
        alert('Failed to create user');
      }
    });
  }
}
