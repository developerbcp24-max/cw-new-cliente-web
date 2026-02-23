import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAbroadBatchDetailComponent } from './transfer-abroad-batch-detail.component';

describe('TransferAbroadBatchDetailComponent', () => {
  let component: TransferAbroadBatchDetailComponent;
  let fixture: ComponentFixture<TransferAbroadBatchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferAbroadBatchDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferAbroadBatchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
