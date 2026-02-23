import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproversAndControllersListComponent } from './approvers-and-controllers-list.component';

describe('ApproversAndControllersListComponent', () => {
  let component: ApproversAndControllersListComponent;
  let fixture: ComponentFixture<ApproversAndControllersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproversAndControllersListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproversAndControllersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
