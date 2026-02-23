import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGroupContentComponent } from './button-group-content.component';

describe('ButtonGroupContentComponent', () => {
  let component: ButtonGroupContentComponent;
  let fixture: ComponentFixture<ButtonGroupContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonGroupContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonGroupContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
