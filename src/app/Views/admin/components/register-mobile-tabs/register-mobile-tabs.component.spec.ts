import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterMobileTabsComponent } from './register-mobile-tabs.component';

describe('RegisterMobileTabsComponent', () => {
  let component: RegisterMobileTabsComponent;
  let fixture: ComponentFixture<RegisterMobileTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterMobileTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterMobileTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
