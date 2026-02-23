import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotOfWarrantyDetailComponent } from './ballot-of-warranty-detail.component';

describe('BallotOfWarrantyDetailComponent', () => {
  let component: BallotOfWarrantyDetailComponent;
  let fixture: ComponentFixture<BallotOfWarrantyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BallotOfWarrantyDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BallotOfWarrantyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
