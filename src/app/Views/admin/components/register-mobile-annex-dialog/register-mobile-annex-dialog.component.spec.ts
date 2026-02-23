import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMobileAnnexDialogComponent } from './register-mobile-annex-dialog.component';

describe('RegisterMobileAnnexDialogComponent', () => {
  let component: RegisterMobileAnnexDialogComponent;
  let fixture: ComponentFixture<RegisterMobileAnnexDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterMobileAnnexDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterMobileAnnexDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
