import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarRouteComponent } from './bar-route.component';

describe('BarRouteComponent', () => {
  let component: BarRouteComponent;
  let fixture: ComponentFixture<BarRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BarRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
