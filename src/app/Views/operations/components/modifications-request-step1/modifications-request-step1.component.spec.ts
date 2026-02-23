import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationsRequestStep1Component } from './modifications-request-step1.component';

describe('ModificationsRequestStep1Component', () => {
  let component: ModificationsRequestStep1Component;
  let fixture: ComponentFixture<ModificationsRequestStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificationsRequestStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationsRequestStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
