import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideCheckDialogComponent } from './slide-check-dialog.component';

describe('SlideCheckDialogComponent', () => {
  let component: SlideCheckDialogComponent;
  let fixture: ComponentFixture<SlideCheckDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlideCheckDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideCheckDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
