import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBallotOfWarrantyDetailComponent } from './new-ballot-of-warranty-detail.component';

describe('NewBallotOfWarrantyDetailComponent', () => {
  let component: NewBallotOfWarrantyDetailComponent;
  let fixture: ComponentFixture<NewBallotOfWarrantyDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBallotOfWarrantyDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBallotOfWarrantyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
