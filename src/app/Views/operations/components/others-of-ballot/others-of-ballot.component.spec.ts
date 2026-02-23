import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersOfBallotComponent } from './others-of-ballot.component';

describe('OthersOfBallotComponent', () => {
  let component: OthersOfBallotComponent;
  let fixture: ComponentFixture<OthersOfBallotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OthersOfBallotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersOfBallotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
