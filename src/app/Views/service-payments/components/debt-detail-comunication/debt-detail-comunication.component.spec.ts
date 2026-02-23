import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtDetailComunicationComponent } from './debt-detail-comunication.component';

describe('DebtDetailComunicationComponent', () => {
  let component: DebtDetailComunicationComponent;
  let fixture: ComponentFixture<DebtDetailComunicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtDetailComunicationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtDetailComunicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
