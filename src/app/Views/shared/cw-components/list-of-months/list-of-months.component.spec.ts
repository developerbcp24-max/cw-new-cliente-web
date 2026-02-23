import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfMonthsComponent } from './list-of-months.component';

describe('ListOfMonthsComponent', () => {
  let component: ListOfMonthsComponent;
  let fixture: ComponentFixture<ListOfMonthsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListOfMonthsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfMonthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
