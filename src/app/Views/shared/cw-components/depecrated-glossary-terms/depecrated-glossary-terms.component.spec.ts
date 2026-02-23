import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedGlossaryTermsComponent } from './depecrated-glossary-terms.component';

describe('DepecratedGlossaryTermsComponent', () => {
  let component: DepecratedGlossaryTermsComponent;
  let fixture: ComponentFixture<DepecratedGlossaryTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedGlossaryTermsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedGlossaryTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
