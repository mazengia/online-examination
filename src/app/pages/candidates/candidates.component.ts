import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzDrawerService} from 'ng-zorro-antd/drawer';
import {FirestoreService} from '../../services/firestore.service';
import {Candidate} from '../../model/Candidate';
import {FireAuthService} from '../../services/fireauth.service';
import {Subscription} from 'rxjs';
import {CommonModule} from '@angular/common';
import {NewCandidateComponent} from './new-candidate/new-candidate.component';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzRowDirective} from 'ng-zorro-antd/grid';
import {Users} from '../../model/user';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzDividerComponent} from 'ng-zorro-antd/divider';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzIconModule,
    NzRowDirective,
    NzDividerComponent
  ],
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css'],
  providers: [NzDrawerService],
})
export class CandidatesComponent implements OnInit, OnDestroy {
  users: any[] = [];
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
    private firestoreService: FirestoreService,
    private notification: NzNotificationService,
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
      this.loadAllData();
    });

    this.subscriptions.add(authSub);
  }

  loadAllData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 0;
    }

    const usersList = this.firestoreService.getAnOrganizationsCandidates(this.isAuthenticated.email).subscribe(
      (users) => {
        this.users = users;
        console.log("users=", users);
      },
      (error: any) => {
        console.error("Error fetching candidates:", error);
      }
    );

    this.subscriptions.add(usersList);
  }

  deleteByDocumentId(documentId: string,userEmail:string) {
    this.firestoreService.deleteCandidateById(documentId,userEmail).then(
      (user) => {
        this.notification.success("Success", "Account updated successfully.");
        this.loadAllData();
      },
      (error) => {
        console.error("Error during sign-up:", error);
      }
    );
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
