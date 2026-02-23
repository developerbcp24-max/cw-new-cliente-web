import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBailDataComponent } from './new-bail-data.component';

describe('NewBailDataComponent', () => {
  let component: NewBailDataComponent;
  let fixture: ComponentFixture<NewBailDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewBailDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBailDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
