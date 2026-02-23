import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproversAndControllersComponent } from './approvers-and-controllers.component';

describe('ApproversAndControllersComponent', () => {
  let component: ApproversAndControllersComponent;
  let fixture: ComponentFixture<ApproversAndControllersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproversAndControllersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproversAndControllersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
