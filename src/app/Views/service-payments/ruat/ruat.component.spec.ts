import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuatComponent } from './ruat.component';

describe('RuatComponent', () => {
  let component: RuatComponent;
  let fixture: ComponentFixture<RuatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
