import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDestinyAccountComponent } from './detail-destiny-account.component';

describe('DetailDestinyAccountComponent', () => {
  let component: DetailDestinyAccountComponent;
  let fixture: ComponentFixture<DetailDestinyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailDestinyAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailDestinyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
