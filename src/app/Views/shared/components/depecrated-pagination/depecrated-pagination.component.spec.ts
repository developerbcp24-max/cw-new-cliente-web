import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedPaginationComponent } from './depecrated-pagination.component';

describe('DepecratedPaginationComponent', () => {
  let component: DepecratedPaginationComponent;
  let fixture: ComponentFixture<DepecratedPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
