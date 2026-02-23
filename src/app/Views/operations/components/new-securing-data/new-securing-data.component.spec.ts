import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSecuringDataComponent } from './new-securing-data.component';

describe('NewSecuringDataComponent', () => {
  let component: NewSecuringDataComponent;
  let fixture: ComponentFixture<NewSecuringDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewSecuringDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSecuringDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
