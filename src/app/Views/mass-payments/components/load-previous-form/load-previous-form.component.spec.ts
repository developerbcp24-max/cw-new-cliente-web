import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPreviousFormComponent } from './load-previous-form.component';

describe('LoadPreviousFormComponent', () => {
  let component: LoadPreviousFormComponent;
  let fixture: ComponentFixture<LoadPreviousFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadPreviousFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadPreviousFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
