import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrMultiplicaBcpComponent } from './qr-multiplica-bcp.component';

describe('QrMultiplicaBcpComponent', () => {
  let component: QrMultiplicaBcpComponent;
  let fixture: ComponentFixture<QrMultiplicaBcpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrMultiplicaBcpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrMultiplicaBcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
