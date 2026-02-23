import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTypeBallotComponent } from './select-type-ballot.component';

describe('SelectTypeBallotComponent', () => {
  let component: SelectTypeBallotComponent;
  let fixture: ComponentFixture<SelectTypeBallotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectTypeBallotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTypeBallotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
