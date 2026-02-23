import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationsRequestStep3Component } from './modifications-request-step3.component';

describe('ModificationsRequestStep3Component', () => {
  let component: ModificationsRequestStep3Component;
  let fixture: ComponentFixture<ModificationsRequestStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificationsRequestStep3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationsRequestStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
