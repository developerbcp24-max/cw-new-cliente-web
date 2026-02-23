import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSwiftReceivedComponent } from './list-swift-received.component';

describe('ListSwiftReceivedComponent', () => {
  let component: ListSwiftReceivedComponent;
  let fixture: ComponentFixture<ListSwiftReceivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListSwiftReceivedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSwiftReceivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
