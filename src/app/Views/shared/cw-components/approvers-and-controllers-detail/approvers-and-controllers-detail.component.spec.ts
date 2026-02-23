import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproversAndControllersDetailComponent } from './approvers-and-controllers-detail.component';

describe('ApproversAndControllersDetailComponent', () => {
  let component: ApproversAndControllersDetailComponent;
  let fixture: ComponentFixture<ApproversAndControllersDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproversAndControllersDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproversAndControllersDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
