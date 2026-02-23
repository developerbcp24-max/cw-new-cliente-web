import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSwiftSentComponent } from './list-swift-sent.component';

describe('ListSwiftSentComponent', () => {
  let component: ListSwiftSentComponent;
  let fixture: ComponentFixture<ListSwiftSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSwiftSentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSwiftSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
