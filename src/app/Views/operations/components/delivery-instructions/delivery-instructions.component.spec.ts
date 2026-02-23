import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryInstructionsComponent } from './delivery-instructions.component';

describe('DeliveryInstructionsComponent', () => {
  let component: DeliveryInstructionsComponent;
  let fixture: ComponentFixture<DeliveryInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryInstructionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
