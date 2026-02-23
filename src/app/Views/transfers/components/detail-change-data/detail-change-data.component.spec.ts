import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailChangeDataComponent } from './detail-change-data.component';

describe('DetailChangeDataComponent', () => {
  let component: DetailChangeDataComponent;
  let fixture: ComponentFixture<DetailChangeDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailChangeDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailChangeDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
