import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzRowDirective} from "ng-zorro-antd/grid";
import {Users} from '../../../model/user';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {FireAuthService} from '../../../services/fireauth.service';

@Component({
  selector: 'app-new-candidate',
  imports: [
    FormsModule,
    NgIf,
    NzButtonComponent,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzInputDirective,
    NzRowDirective,
    ReactiveFormsModule
  ],
  templateUrl: './new-candidate.component.html',
  styleUrl: './new-candidate.component.css'
})
export class NewCandidateComponent implements OnInit {
  @Input() idValue!: number;

  user!: Users;
  errorMessage = '';
  validateForm!: FormGroup
  isAuthenticated: any

  constructor(private notification: NzNotificationService,
              private fb: FormBuilder,
              private authService: FireAuthService,
  ) {
    this.validateForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
      createdAt: this.fb.control(new Date().toISOString()),
      role: this.fb.control('candidate'),
      organizationId: this.fb.control(this.isAuthenticated?.email)
    });
  }

  ngOnInit() {
    this.authService.isAuthenticated().subscribe((authenticated) => {
      this.isAuthenticated = authenticated;
    });
  }

  signUpCandidates() {
    this.validateForm.controls['organizationId'].setValue(this.isAuthenticated?.email)
    this.authService.signUpWithEmailAndPasswordCandidates(this.validateForm.value).then(
      (user) => {
        this.notification.success("Success", "Account created successfully.");
      },
      (error) => {
        console.error("Error during sign-up:", error);
      }
    );

  }

}
