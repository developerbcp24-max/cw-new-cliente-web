import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAbroadDetailComponent } from './transfer-abroad-detail.component';

describe('TransferAbroadDetailComponent', () => {
  let component: TransferAbroadDetailComponent;
  let fixture: ComponentFixture<TransferAbroadDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferAbroadDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferAbroadDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
