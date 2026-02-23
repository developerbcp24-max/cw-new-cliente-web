import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotOfWarrantyComponent } from './ballot-of-warranty.component';

describe('BallotOfWarrantyComponent', () => {
  let component: BallotOfWarrantyComponent;
  let fixture: ComponentFixture<BallotOfWarrantyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BallotOfWarrantyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotOfWarrantyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
