import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUpdateUserInfoComponent } from './dialog-update-user-info.component';

describe('DialogUpdateUserInfoComponent', () => {
  let component: DialogUpdateUserInfoComponent;
  let fixture: ComponentFixture<DialogUpdateUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogUpdateUserInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogUpdateUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
