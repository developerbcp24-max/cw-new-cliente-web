import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavSalariesComponent } from './fav-salaries.component';

describe('FavSalariesComponent', () => {
  let component: FavSalariesComponent;
  let fixture: ComponentFixture<FavSalariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavSalariesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavSalariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
