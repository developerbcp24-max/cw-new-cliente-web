import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavProvidersComponent } from './fav-providers.component';

describe('FavProvidersComponent', () => {
  let component: FavProvidersComponent;
  let fixture: ComponentFixture<FavProvidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavProvidersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavProvidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
