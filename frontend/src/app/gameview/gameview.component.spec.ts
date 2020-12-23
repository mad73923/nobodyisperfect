import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameviewComponent } from './gameview.component';

describe('GameviewComponent', () => {
  let component: GameviewComponent;
  let fixture: ComponentFixture<GameviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
