import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificationDepositsComponent } from './identification-deposits.component';

describe('IdentificationDepositsComponent', () => {
  let component: IdentificationDepositsComponent;
  let fixture: ComponentFixture<IdentificationDepositsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdentificationDepositsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificationDepositsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
