import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntermediaryBankFormAbroadComponent } from './intermediary-bank-form-abroad.component';

describe('IntermediaryBankFormAbroadComponent', () => {
  let component: IntermediaryBankFormAbroadComponent;
  let fixture: ComponentFixture<IntermediaryBankFormAbroadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntermediaryBankFormAbroadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntermediaryBankFormAbroadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
