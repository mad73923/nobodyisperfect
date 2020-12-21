import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestiontableComponent } from './questiontable.component';

describe('QuestiontableComponent', () => {
  let component: QuestiontableComponent;
  let fixture: ComponentFixture<QuestiontableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestiontableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestiontableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
