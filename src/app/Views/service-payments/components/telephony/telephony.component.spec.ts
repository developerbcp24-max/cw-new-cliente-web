import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephonyComponent } from './telephony.component';

describe('TelephonyComponent', () => {
  let component: TelephonyComponent;
  let fixture: ComponentFixture<TelephonyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelephonyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelephonyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
