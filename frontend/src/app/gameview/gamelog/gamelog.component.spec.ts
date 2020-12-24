import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamelogComponent } from './gamelog.component';

describe('GamelogComponent', () => {
  let component: GamelogComponent;
  let fixture: ComponentFixture<GamelogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamelogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
