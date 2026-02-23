import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedApproversAndControllersComponent } from './depecrated-approvers-and-controllers.component';

describe('DepecratedApproversAndControllersComponent', () => {
  let component: DepecratedApproversAndControllersComponent;
  let fixture: ComponentFixture<DepecratedApproversAndControllersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedApproversAndControllersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedApproversAndControllersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
