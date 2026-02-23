import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfpDebtDetailComponent } from './afp-debt-detail.component';

describe('AfpDebtDetailComponent', () => {
  let component: AfpDebtDetailComponent;
  let fixture: ComponentFixture<AfpDebtDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfpDebtDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AfpDebtDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
