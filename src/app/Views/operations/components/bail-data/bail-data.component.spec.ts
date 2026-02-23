import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BailDataComponent } from './bail-data.component';

describe('BailDataComponent', () => {
  let component: BailDataComponent;
  let fixture: ComponentFixture<BailDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BailDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BailDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
