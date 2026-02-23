import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAbroadFormBatchDetailComponent } from './transfer-abroad-form-batch-detail.component';

describe('TransferAbroadFormBatchDetailComponent', () => {
  let component: TransferAbroadFormBatchDetailComponent;
  let fixture: ComponentFixture<TransferAbroadFormBatchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferAbroadFormBatchDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferAbroadFormBatchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
