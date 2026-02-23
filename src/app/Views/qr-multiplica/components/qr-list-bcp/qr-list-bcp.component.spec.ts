import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrListBcpComponent } from './qr-list-bcp.component';

describe('QrListBcpComponent', () => {
  let component: QrListBcpComponent;
  let fixture: ComponentFixture<QrListBcpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrListBcpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrListBcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
