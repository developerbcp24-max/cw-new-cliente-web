import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCheckSentComponent } from './list-check-sent.component';

describe('ListCheckSentComponent', () => {
  let component: ListCheckSentComponent;
  let fixture: ComponentFixture<ListCheckSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCheckSentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListCheckSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
