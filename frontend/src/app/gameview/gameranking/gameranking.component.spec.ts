import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamerankingComponent } from './gameranking.component';

describe('GamerankingComponent', () => {
  let component: GamerankingComponent;
  let fixture: ComponentFixture<GamerankingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamerankingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamerankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
