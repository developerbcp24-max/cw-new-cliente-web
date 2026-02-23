import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedDateFutureComponent } from './depecrated-date-future.component';

describe('DepecratedDateFutureComponent', () => {
  let component: DepecratedDateFutureComponent;
  let fixture: ComponentFixture<DepecratedDateFutureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedDateFutureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedDateFutureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
