import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceCodeComponent } from './invoice-code.component';

describe('InvoiceCodeComponent', () => {
  let component: InvoiceCodeComponent;
  let fixture: ComponentFixture<InvoiceCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoiceCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
