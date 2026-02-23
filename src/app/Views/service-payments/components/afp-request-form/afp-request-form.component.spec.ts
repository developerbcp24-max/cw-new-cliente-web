import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfpRequestFormComponent } from './afp-request-form.component';

describe('AfpRequestFormComponent', () => {
  let component: AfpRequestFormComponent;
  let fixture: ComponentFixture<AfpRequestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfpRequestFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AfpRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
