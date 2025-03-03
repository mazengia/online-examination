import {Component, OnInit} from '@angular/core';
import {NgForOf} from "@angular/common";
import {NzCellAlignDirective, NzTableComponent} from "ng-zorro-antd/table";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzRowDirective} from "ng-zorro-antd/grid";
import {Candidate} from '../../model/Candidate';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NzDrawerService} from 'ng-zorro-antd/drawer';
import {FirestoreService} from '../../services/firestore.service';
import {NewCandidateComponent} from '../candidates/new-candidate/new-candidate.component';
import {NewQuestionsComponent} from './new-quesitions/new-questions.component';

@Component({
  selector: 'app-questions',
    imports: [
        NgForOf,
        NzCellAlignDirective,
        NzIconDirective,
        NzRowDirective,
        NzTableComponent
    ],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css',
  providers: [NzDrawerService],
})
export class QuestionsComponent implements OnInit {
  candidates: Candidate[] = []
  totalElements!: number;
  pageIndex = 0;
  pageSize = 10;
  loading = true;
  transactions: any[] = [];
  searchForm: FormGroup;

  constructor(
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
      .create<NewQuestionsComponent, { id: number }>({
        nzWidth: 600,
        nzPlacement: "right",
        nzContent: NewQuestionsComponent,
        nzContentParams: {
          idValue: requestId,
        },
      })

    drawerRef.afterClose.subscribe(() => {
      this.loadAllData()
    })
  }

}



