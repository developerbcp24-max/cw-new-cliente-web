import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectronicBillComponent } from './electronic-bill.component';

describe('ElectronicBillComponent', () => {
  let component: ElectronicBillComponent;
  let fixture: ComponentFixture<ElectronicBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElectronicBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectronicBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
