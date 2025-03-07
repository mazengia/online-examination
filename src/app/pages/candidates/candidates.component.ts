import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzDrawerService} from 'ng-zorro-antd/drawer';
import {FirestoreService} from '../../services/firestore.service';
import {Subscription} from 'rxjs';
import {CommonModule} from '@angular/common';
import {NewCandidateComponent} from './new-candidate/new-candidate.component';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzRowDirective} from 'ng-zorro-antd/grid';
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NzDividerComponent} from 'ng-zorro-antd/divider';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptorService} from '../../auth-interceptor.service';
import {CandidateService} from '../../services/candidate.service';

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
  providers: [
    NzDrawerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
})
export class CandidatesComponent implements OnInit, OnDestroy {
  users: any[] = [];
  totalElements!: number;
  pageIndex = 0;
  pageSize = 10;
  loading: boolean = false;
  isAuthenticated: any;
  searchForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private drawerService: NzDrawerService,
    private firestoreService: FirestoreService,
    private candidateService: CandidateService,
    private notification: NzNotificationService,
  ) {
    this.searchForm = this.formBuilder.group({
      dateRange: [null, Validators.required],
      branchCode: [null, Validators.required],
      commissionId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.isAuthenticated = localStorage.getItem('firebase_user');
    this.getAllCandidate();
    this.loadAllDataByEmail();
  }
  getAllCandidate(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 0;
    }
    this.loading = true;
    this.candidateService.getAllCandidate(this.pageIndex, this.pageSize).subscribe(
      response => {
        this.users = response?.content || [];
        this.totalElements = response?.totalElements ?? 0;
      },
      (error) => {
        console.log(error, "from error");
      }
    );
    this.loading = false;
  }
  loadAllData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 0;
    }

    const usersList = this.firestoreService.getAnOrganizationsCandidates(this.isAuthenticated).subscribe(
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

  loadAllDataByEmail() {

    this.firestoreService.loadAllDataByEmail('mz.tesfa@gmail.com').subscribe(
      (users) => {
        console.log("yyy users=", users);
      },
      (error: any) => {
        console.error("Error fetching users yy:", error);
      }
    );

  }

  deleteByDocumentId(documentId: string, userEmail: string) {
    this.firestoreService.deleteCandidateById(documentId, userEmail).then(
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
