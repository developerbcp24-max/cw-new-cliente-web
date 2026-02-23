import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewElectronicBillComponent } from './new-electronic-bill.component';

describe('NewElectronicBillComponent', () => {
  let component: NewElectronicBillComponent;
  let fixture: ComponentFixture<NewElectronicBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewElectronicBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewElectronicBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
