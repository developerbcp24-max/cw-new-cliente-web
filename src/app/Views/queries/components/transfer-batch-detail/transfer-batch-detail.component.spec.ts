import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferBatchDetailComponent } from './transfer-batch-detail.component';

describe('TransferBatchDetailComponent', () => {
  let component: TransferBatchDetailComponent;
  let fixture: ComponentFixture<TransferBatchDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferBatchDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferBatchDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
