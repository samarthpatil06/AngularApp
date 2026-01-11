import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../accounts.component';


@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

  @Output() save = new EventEmitter<User>();
  @Output() close = new EventEmitter<void>();

  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'User',
    active: true
  };

  password = '';
  confirmPassword = '';

  submit(): void {
    this.save.emit({ ...this.user });
  }
}
