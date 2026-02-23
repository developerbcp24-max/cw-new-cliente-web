import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPaseServiceComponent } from './new-pase-service.component';

describe('NewPaseServiceComponent', () => {
  let component: NewPaseServiceComponent;
  let fixture: ComponentFixture<NewPaseServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPaseServiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPaseServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
