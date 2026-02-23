import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CwRolesDialogComponent } from './cw-roles-dialog.component';

describe('CwRolesDialogComponent', () => {
  let component: CwRolesDialogComponent;
  let fixture: ComponentFixture<CwRolesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CwRolesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CwRolesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
