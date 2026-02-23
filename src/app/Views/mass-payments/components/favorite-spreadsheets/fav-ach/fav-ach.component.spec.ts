import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavAchComponent } from './fav-ach.component';

describe('FavAchComponent', () => {
  let component: FavAchComponent;
  let fixture: ComponentFixture<FavAchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavAchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavAchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
