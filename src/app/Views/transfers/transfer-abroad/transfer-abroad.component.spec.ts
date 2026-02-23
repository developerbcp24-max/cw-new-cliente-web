import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferAbroadComponent } from './transfer-abroad.component';

describe('TransferAbroadComponent', () => {
  let component: TransferAbroadComponent;
  let fixture: ComponentFixture<TransferAbroadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferAbroadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferAbroadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
