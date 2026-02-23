import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesterFormAbroadComponent } from './requester-form-abroad.component';

describe('RequesterFormAbroadComponent', () => {
  let component: RequesterFormAbroadComponent;
  let fixture: ComponentFixture<RequesterFormAbroadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequesterFormAbroadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequesterFormAbroadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
