import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtElfecComponent } from './debt-elfec.component';

describe('DebtElfecComponent', () => {
  let component: DebtElfecComponent;
  let fixture: ComponentFixture<DebtElfecComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtElfecComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtElfecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
