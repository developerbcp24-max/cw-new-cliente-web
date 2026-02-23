import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedListOfMonthsComponent } from './depecrated-list-of-months.component';

describe('DepecratedListOfMonthsComponent', () => {
  let component: DepecratedListOfMonthsComponent;
  let fixture: ComponentFixture<DepecratedListOfMonthsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedListOfMonthsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedListOfMonthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
