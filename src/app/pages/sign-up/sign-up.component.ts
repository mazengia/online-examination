import { Component } from '@angular/core';
import {Users} from '../../model/user';
import {FireAuthService} from '../../services/fireauth.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  imports: [
    NgIf,
    FormsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  user!: Users;
  name: string = '';
  role: string = 'voter';
  email = '';
  password = '';
  errorMessage = '';


  constructor(private authService: FireAuthService, private router: Router) {
  }

  signUp() {
    if (this.email && this.password) {
      const newUser: Users = {
        name: this.name,
        role: this.role,
        email: this.email,
        password: this.password,
        createdAt: new Date().toISOString(),
      };
      this.authService.signUpWithEmailAndPassword(newUser).then(
        (user) => {
          this.router.navigate(['/sign-in']);  // Redirect to home after successful sign up
        },
        (error) => {
          this.errorMessage = error.message;
          console.error('Sign up error:', error);
        }
      );
    } else {
      this.errorMessage = 'Please fill in both email and password.';
    }
  }
}

