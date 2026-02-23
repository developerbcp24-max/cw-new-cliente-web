import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsTransfersAbroadComponent } from './terms-transfers-abroad.component';

describe('TermsTransfersAbroadComponent', () => {
  let component: TermsTransfersAbroadComponent;
  let fixture: ComponentFixture<TermsTransfersAbroadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsTransfersAbroadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsTransfersAbroadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
