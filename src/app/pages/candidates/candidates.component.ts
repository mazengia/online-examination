import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzRowDirective} from "ng-zorro-antd/grid";
import {NzNotificationService} from 'ng-zorro-antd/notification';
import {NewCandidateComponent} from './new-candidate/new-candidate.component';
import {NzDrawerService} from 'ng-zorro-antd/drawer';
import {NzCellAlignDirective, NzTableComponent} from 'ng-zorro-antd/table';
import {NzIconDirective} from 'ng-zorro-antd/icon';
import {FirestoreService} from '../../services/firestore.service';
import {Candidate} from '../../model/Candidate';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-candidates',
  imports: [
    FormsModule,
    NzRowDirective,
    ReactiveFormsModule,
    NzTableComponent,
    NzIconDirective,
    NzCellAlignDirective,
    NgForOf
  ],
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.css',
  providers: [NzDrawerService],
})
export class CandidatesComponent implements OnInit {
  candidates: Candidate[] = []
  totalElements!: number;
  pageIndex = 0;
  pageSize = 10;
  loading = true;
  transactions: any[] = [];
  searchForm: FormGroup;
  isVisible = false;

  constructor(
    private notification: NzNotificationService,
    private formBuilder: FormBuilder,
    private drawerService: NzDrawerService,
    private candidateService: FirestoreService) {
    this.searchForm = this.formBuilder.group({
      dateRange: [null, Validators.required],
      branchCode: [null, Validators.required],
      commissionId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadAllData();
  }


  loadAllData(reset: boolean = false) {
    if (reset) {
      this.pageIndex = 0;
    }
     this.candidateService.getAllCandidates().subscribe(
      (candidates: Candidate[]) => {
        this.candidates = candidates;
        console.log("candidates=", candidates)
      },
      (error) => {
        console.error("Error   candidates:", error);
      }
    );

  }


  openDrawer(requestId: any) {

    const drawerRef = this.drawerService
      .create<NewCandidateComponent, { id: number }>({
        nzWidth: 600,
        nzPlacement: "right",
        nzContent: NewCandidateComponent,
        nzContentParams: {
          idValue: requestId,
        },
      })

    drawerRef.afterClose.subscribe(() => {
      this.loadAllData()
    })
  }


  openDetailDrawer(requestId: any) {
    const drawerRef = this.drawerService
      .create<NewCandidateComponent, { requestId: any }>({
        nzWidth: "900px",
        nzContent: NewCandidateComponent,
        nzContentParams: {
          requestId: requestId,
        },
      })


    drawerRef.afterClose.subscribe(() => {
      this.loadAllData()
    })
  }

  deleteById(requestId: any): void {

  }

  showModal(requestId: any): void {
    this.getDataById(requestId)
    this.isVisible = true;
  }

  getDataById(requestId: any) {

  }

}


