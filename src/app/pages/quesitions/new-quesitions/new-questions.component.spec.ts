import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewQuestionsComponent } from './new-questions.component';

describe('NewQuesitionsComponent', () => {
  let component: NewQuestionsComponent;
  let fixture: ComponentFixture<NewQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewQuestionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
