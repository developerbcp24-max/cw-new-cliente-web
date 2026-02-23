import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAbroadStep1Component } from './transfer-abroad-step1.component';

describe('TransferAbroadStep1Component', () => {
  let component: TransferAbroadStep1Component;
  let fixture: ComponentFixture<TransferAbroadStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferAbroadStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferAbroadStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
