import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { NzDrawerService } from 'ng-zorro-antd/drawer';
import { FirestoreService } from '../../services/firestore.service';
import { Candidate } from '../../model/Candidate';
import { FireAuthService } from '../../services/fireauth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NewCandidateComponent } from './new-candidate/new-candidate.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import {NzRowDirective} from 'ng-zorro-antd/grid';
import {Users} from '../../model/user';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzIconModule,
    NzRowDirective
  ],
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css'],
  providers: [NzDrawerService],
})
export class CandidatesComponent implements OnInit, OnDestroy {
  users: Users[] = [];
  totalElements!: number;
  pageIndex = 0;
  pageSize = 10;
  transactions: any[] = [];
  isAuthenticated: any;
  searchForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private drawerService: NzDrawerService,
    private authService: FireAuthService,
    private candidateService: FirestoreService
  ) {
    this.searchForm = this.formBuilder.group({
      dateRange: [null, Validators.required],
      branchCode: [null, Validators.required],
      commissionId: [null, Validators.required]
    });
  }

  ngOnInit() {
    const authSub = this.authService.isAuthenticated().subscribe(authenticated => {
      this.isAuthenticated = authenticated;
      console.log("this.isAuthenticated=", this.isAuthenticated);
      this.loadAllData();
    });

    this.subscriptions.add(authSub);
  }

  loadAllData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 0;
    }

    const usersList = this.candidateService.getAnOrganizationsCandidates(this.isAuthenticated.email).subscribe(
      (users: Users[]) => {
        this.users = users;
        console.log("users=", users);
      },
      (error: any) => {
        console.error("Error fetching candidates:", error);
      }
    );

    this.subscriptions.add(usersList);
  }

  openDrawer(requestId: any) {
    const drawerRef = this.drawerService.create<NewCandidateComponent, { id: number }>({
      nzWidth: 600,
      nzPlacement: "right",
      nzContent: NewCandidateComponent,
      nzContentParams: {
        idValue: requestId,
      },
    });

    drawerRef.afterClose.subscribe(() => this.loadAllData());
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
