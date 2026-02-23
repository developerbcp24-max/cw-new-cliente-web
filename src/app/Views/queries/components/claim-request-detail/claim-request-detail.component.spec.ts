import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimRequestDetailComponent } from './claim-request-detail.component';

describe('ClaimRequestDetailComponent', () => {
  let component: ClaimRequestDetailComponent;
  let fixture: ComponentFixture<ClaimRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimRequestDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
