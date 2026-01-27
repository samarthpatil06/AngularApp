import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Ensure FormsModule is here for inputs

// 1. DEFINE THE INTERFACE HERE LOCALLY
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'Admin' | 'User';
  active: boolean;
}

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {
  password: string = '';
  confirmPassword: string = '';
  close = new EventEmitter<void>();

  // 2. Use the local User interface here
  @Output() save = new EventEmitter<User>();

  // 3. Initialize the form data
  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'User',
    active: true
  };

  onSubmit() {
    // Emit the data to the parent component
    this.save.emit(this.user);

    // Reset the form
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'User',
      active: true
    };
  }

  onClose() {
    this.close.emit();
  }

  submit(): void {
    // Add your submit logic here
    if (this.password !== this.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }
    // Handle user creation
    console.log('User created:', this.user);
  }
}