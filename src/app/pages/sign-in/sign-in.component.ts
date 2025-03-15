import {Component} from '@angular/core';
import {FireAuthService} from '../../services/fireauth.service';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptorService} from '../../auth-interceptor.service';
import {AuthResponse} from '../../model/authResponse';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
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
        (authResponse: AuthResponse) => {
          console.log('User signed in successfully:', authResponse);
          const token = authResponse.idToken;
          const email = authResponse.email;
          const displayName = authResponse.displayName;
          const refreshToken = authResponse.refreshToken;
          const expiresIn = authResponse.expiresIn;
          localStorage.setItem('firebase_token', token);
          localStorage.setItem('firebase_user', email);
          localStorage.setItem('displayName', displayName);
          localStorage.setItem('firebase_refresh_token', refreshToken);
          localStorage.setItem('firebase_token_expiry', (Date.now() + expiresIn * 1000).toString()); // Store expiry timestamp

          this.router.navigate(['/welcome']).then(() => {
            window.location.reload();
          });
        },
        (error) => {
          this.errorMessage = error?.error?.ApiError?.message || 'An error occurred during sign-in.';
          console.error('Sign-in error:', error?.error?.ApiError?.message);
        }
      );
    } else {
      this.errorMessage = 'Please fill in both email and password.';
    }
  }

}
