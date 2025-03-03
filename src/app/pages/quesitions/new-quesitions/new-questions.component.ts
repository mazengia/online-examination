import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {NzInputDirective} from "ng-zorro-antd/input";
import {NzRowDirective} from "ng-zorro-antd/grid";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Users} from '../../../model/user';
import {FirestoreService} from '../../../services/firestore.service';
import {Router} from '@angular/router';
import {NzNotificationService} from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-new-quesitions',
    imports: [
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
  templateUrl: './new-questions.component.html',
  styleUrl: './new-questions.component.css'
})
export class NewQuestionsComponent {
  @Input() idValue!: number;

  user!: Users;
  name: string = '';
  role: string = 'voter';
  email = '';
  password = '';
  errorMessage = '';
  validateForm!: FormGroup

  constructor(private candidateService: FirestoreService,
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
    this.candidateService.addNewRecord(this.validateForm.value).then(
      (user) => {
        this.notification.success("Success", "Account created successfully.");
      },
      (error) => {
        console.error("Error during sign-up:", error);
      }
    );

  }

}

