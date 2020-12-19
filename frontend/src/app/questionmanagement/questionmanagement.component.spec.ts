import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionmanagementComponent } from './questionmanagement.component';

describe('QuestionmanagementComponent', () => {
  let component: QuestionmanagementComponent;
  let fixture: ComponentFixture<QuestionmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
