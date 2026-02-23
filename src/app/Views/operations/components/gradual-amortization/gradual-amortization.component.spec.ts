import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradualAmortizationComponent } from './gradual-amortization.component';

describe('GradualAmortizationComponent', () => {
  let component: GradualAmortizationComponent;
  let fixture: ComponentFixture<GradualAmortizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GradualAmortizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GradualAmortizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
