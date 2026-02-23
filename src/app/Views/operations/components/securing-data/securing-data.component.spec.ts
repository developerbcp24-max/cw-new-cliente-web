import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuringDataComponent } from './securing-data.component';

describe('SecuringDataComponent', () => {
  let component: SecuringDataComponent;
  let fixture: ComponentFixture<SecuringDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecuringDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuringDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
