import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationsRequestStep2Component } from './modifications-request-step2.component';

describe('ModificationsRequestStep2Component', () => {
  let component: ModificationsRequestStep2Component;
  let fixture: ComponentFixture<ModificationsRequestStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificationsRequestStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationsRequestStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
