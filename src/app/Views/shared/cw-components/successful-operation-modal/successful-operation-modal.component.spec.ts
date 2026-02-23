import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessfulOperationModalComponent } from './successful-operation-modal.component';

describe('SuccessfulOperationModalComponent', () => {
  let component: SuccessfulOperationModalComponent;
  let fixture: ComponentFixture<SuccessfulOperationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessfulOperationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfulOperationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
