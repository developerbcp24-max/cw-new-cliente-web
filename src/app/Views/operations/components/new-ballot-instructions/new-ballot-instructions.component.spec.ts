import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBallotInstructionsComponent } from './new-ballot-instructions.component';

describe('NewBallotInstructionsComponent', () => {
  let component: NewBallotInstructionsComponent;
  let fixture: ComponentFixture<NewBallotInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBallotInstructionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBallotInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
