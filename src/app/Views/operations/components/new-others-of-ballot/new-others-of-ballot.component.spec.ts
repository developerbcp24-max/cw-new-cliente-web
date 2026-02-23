import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOthersOfBallotComponent } from './new-others-of-ballot.component';

describe('NewOthersOfBallotComponent', () => {
  let component: NewOthersOfBallotComponent;
  let fixture: ComponentFixture<NewOthersOfBallotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOthersOfBallotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOthersOfBallotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
