import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliationDocumentDialogComponent } from './affiliation-document-dialog.component';

describe('AffiliationDocumentDialogComponent', () => {
  let component: AffiliationDocumentDialogComponent;
  let fixture: ComponentFixture<AffiliationDocumentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AffiliationDocumentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffiliationDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
