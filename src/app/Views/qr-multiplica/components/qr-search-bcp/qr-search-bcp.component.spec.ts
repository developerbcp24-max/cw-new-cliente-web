import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrSearchBcpComponent } from './qr-search-bcp.component';

describe('QrSearchBcpComponent', () => {
  let component: QrSearchBcpComponent;
  let fixture: ComponentFixture<QrSearchBcpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrSearchBcpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrSearchBcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
