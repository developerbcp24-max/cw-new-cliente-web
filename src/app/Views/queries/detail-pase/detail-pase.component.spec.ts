import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPaseComponent } from './detail-pase.component';

describe('DetailPaseComponent', () => {
  let component: DetailPaseComponent;
  let fixture: ComponentFixture<DetailPaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
