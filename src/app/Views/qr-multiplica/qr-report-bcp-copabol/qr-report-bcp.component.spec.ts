import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrReportBcpComponent } from './qr-report-bcp.component';

describe('QrReportBcpComponent', () => {
  let component: QrReportBcpComponent;
  let fixture: ComponentFixture<QrReportBcpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrReportBcpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrReportBcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
