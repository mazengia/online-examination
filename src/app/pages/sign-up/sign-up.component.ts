import {Component} from '@angular/core';
import {Users} from '../../model/user';
import {FireAuthService} from '../../services/fireauth.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from 'ng-zorro-antd/form';
import {NzInputDirective} from 'ng-zorro-antd/input';
import {NzButtonComponent} from 'ng-zorro-antd/button';
import {NzRowDirective} from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-sign-up',
  imports: [
    NgIf,
    FormsModule,
    NzFormDirective,
    NzInputDirective,
    ReactiveFormsModule,
    NzFormLabelComponent,
    NzFormItemComponent,
    NzFormControlComponent,
    NzButtonComponent,
    NzRowDirective
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
  validateForm!: FormGroup

  constructor(private authService: FireAuthService,
              private router: Router,
              private notification: NzNotificationService,
              private fb: FormBuilder
  ) {
    this.validateForm = this.fb.group({
      fullName: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
      createdAt: this.fb.control(new Date().toISOString())
    });
  }

  signUp() {
    this.authService.signUpWithEmailAndPassword(this.validateForm.value).then(
      (user) => {
        this.notification.success("Success", "Account created successfully. Please verify your email and log in again.");
        this.router.navigate(['/sign-in']);
      },
      (error) => {
        console.error("Error during sign-up:", error);
        this.handleSignUpError(error);
      }
    );

  }

  handleSignUpError(error: any) {
    let message = 'An unexpected error occurred. Please try again later.';

    if (error.code === 'auth/invalid-email') {
      message = 'The email address is not valid.';
    } else if (error.code === 'auth/email-already-in-use') {
      message = 'The email address is already in use.';
    } else if (error.code === 'auth/weak-password') {
      message = 'Password should be at least 6 characters long.';
    } else if (error.code === 'auth/missing-email' || error.code === 'auth/missing-password') {
      message = 'Please enter both email and password.';
    }

    this.errorMessage = message;
  }

}

