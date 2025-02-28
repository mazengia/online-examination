import { Component } from '@angular/core';
import {FireAuthService} from '../../services/fireauth.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-sign-in',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: FireAuthService, private router: Router) {}




  signIn() {
    if (this.email && this.password) {
      this.authService.signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          console.log('User signed in successfully:', user);
          this.router.navigate(['/candidates']);  // Redirect to home after successful sign in
        },
        (error) => {
          this.errorMessage = error.message;
          console.error('Sign in error:', error);
        }
      );
    } else {
      this.errorMessage = 'Please fill in both email and password.';
    }
  }
}
