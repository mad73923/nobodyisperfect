import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamepickanswerComponent } from './gamepickanswer.component';

describe('GamepickanswerComponent', () => {
  let component: GamepickanswerComponent;
  let fixture: ComponentFixture<GamepickanswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamepickanswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamepickanswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
