import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameoverviewComponent } from './gameoverview.component';

describe('GameoverviewComponent', () => {
  let component: GameoverviewComponent;
  let fixture: ComponentFixture<GameoverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameoverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
