import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedSaveFavoritesComponent } from './depecrated-save-favorites.component';

describe('DepecratedSaveFavoritesComponent', () => {
  let component: DepecratedSaveFavoritesComponent;
  let fixture: ComponentFixture<DepecratedSaveFavoritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedSaveFavoritesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedSaveFavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
