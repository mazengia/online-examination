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
import {FirestoreService} from '../../../services/firestore.service';
import {CandidateService} from '../../../services/candidate.service';

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
  @Input() idValue!: string;

  user!: Users;
  errorMessage = '';
  validateForm!: FormGroup
  isAuthenticated: any

  constructor(private notification: NzNotificationService,
              private fb: FormBuilder,
              private candidateService: CandidateService,
              private authService: FireAuthService,
              private firestoreService: FirestoreService
  ) {
    this.validateForm = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      phoneNumber: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required]),
      password: this.fb.control('', [Validators.required]),
      role: this.fb.control('candidate'),
      organizationId: this.fb.control(this.isAuthenticated)
    });
  }

  ngOnInit() {
    this.isAuthenticated = localStorage.getItem('firebase_user')
    if (this.idValue) {
      this.getCandidateByDocumentId();
    }
  }

  onFormSubmit() {
    if (this.idValue) {
      this.updateCandidates();
    } else {
      this.addNewCandidates();
    }
  }

  addNewCandidates() {
    this.validateForm.controls['organizationId'].setValue(this.isAuthenticated)
    this.candidateService.addNewUser(this.validateForm.value).subscribe(
      (user) => {
        this.notification.success("Success", "Account created successfully.");
      },
      (error) => {
        console.error("Error during sign-up:", error);
      }
    );
  }

  signUpCandidates() {
    this.validateForm.controls['organizationId'].setValue(this.isAuthenticated)
    this.authService.signUpWithEmailAndPasswordCandidates(this.validateForm.value).then(
      (user) => {
        this.notification.success("Success", "Account created successfully.");
      },
      (error) => {
        console.error("Error during sign-up:", error);
      }
    );

  }

  updateCandidates() {
    this.validateForm.controls['organizationId'].setValue(this.isAuthenticated?.email)
    this.firestoreService.updateCandidateById(this.idValue, this.validateForm.value).then(
      (user) => {
        this.notification.success("Success", "Account updated successfully.");
      },
      (error) => {
        console.error("Error during sign-up:", error);
      }
    );

  }

  private async getCandidateByDocumentId() {
    try {
      const user = await this.firestoreService.getCandidateById(this.idValue);
      if (user) {
        console.log("User=", user);
        this.validateForm.patchValue(user);
      }
    } catch (error) {
      console.error("Error fetching candidate:", error);
    }
  }

}
