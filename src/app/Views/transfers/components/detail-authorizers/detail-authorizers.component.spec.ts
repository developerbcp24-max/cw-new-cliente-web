import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailAuthorizersComponent } from './detail-authorizers.component';

describe('DetailAuthorizersComponent', () => {
  let component: DetailAuthorizersComponent;
  let fixture: ComponentFixture<DetailAuthorizersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailAuthorizersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailAuthorizersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
