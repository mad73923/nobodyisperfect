import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionrowComponent } from './questionrow.component';

describe('QuestionrowComponent', () => {
  let component: QuestionrowComponent;
  let fixture: ComponentFixture<QuestionrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
