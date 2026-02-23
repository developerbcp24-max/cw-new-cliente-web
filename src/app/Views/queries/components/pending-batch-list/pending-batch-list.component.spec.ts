import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingBatchListComponent } from './pending-batch-list.component';

describe('PendingBatchListComponent', () => {
  let component: PendingBatchListComponent;
  let fixture: ComponentFixture<PendingBatchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingBatchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingBatchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
