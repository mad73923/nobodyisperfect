import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewuserComponent } from './addnewuser.component';

describe('AddnewuserComponent', () => {
  let component: AddnewuserComponent;
  let fixture: ComponentFixture<AddnewuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddnewuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddnewuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
