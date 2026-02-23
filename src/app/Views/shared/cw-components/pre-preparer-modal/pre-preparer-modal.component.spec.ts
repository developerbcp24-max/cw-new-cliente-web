import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrePreparerModalComponent } from './pre-preparer-modal.component';

describe('PrePreparerModalComponent', () => {
  let component: PrePreparerModalComponent;
  let fixture: ComponentFixture<PrePreparerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrePreparerModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrePreparerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
