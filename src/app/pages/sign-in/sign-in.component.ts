import {Component} from '@angular/core';
import {FireAuthService} from '../../services/fireauth.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptorService} from '../../auth-interceptor.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  imports: [
    FormsModule,
    NgIf
  ],
})
export class SignInComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: FireAuthService, private router: Router) {
  }


  signIn() {
    if (this.email && this.password) {
      this.authService.login(this.email, this.password).subscribe(
        (user) => {
          console.log('User signed in successfully:', user);

          // Assuming the token is returned in the user object
          const token = user.idToken;
          const email = user.email
          localStorage.setItem('firebase_token', token);
          localStorage.setItem('firebase_user', email);
          this.router.navigate(['/welcome']);
        },
        (error) => {
          this.errorMessage = error.message || 'An error occurred during sign-in.';
          console.error('Sign in error:', error);
        }
      );
    } else {
      this.errorMessage = 'Please fill in both email and password.';
    }
  }


}
