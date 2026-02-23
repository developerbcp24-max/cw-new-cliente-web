import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchComponent } from './ach.component';

describe('AchComponent', () => {
  let component: AchComponent;
  let fixture: ComponentFixture<AchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
