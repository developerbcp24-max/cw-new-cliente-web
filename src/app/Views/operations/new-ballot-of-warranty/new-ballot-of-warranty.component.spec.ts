import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBallotOfWarrantyComponent } from './new-ballot-of-warranty.component';

describe('NewBallotOfWarrantyComponent', () => {
  let component: NewBallotOfWarrantyComponent;
  let fixture: ComponentFixture<NewBallotOfWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBallotOfWarrantyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBallotOfWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
