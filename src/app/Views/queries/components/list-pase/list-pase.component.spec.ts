import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPaseComponent } from './list-pase.component';

describe('ListPaseComponent', () => {
  let component: ListPaseComponent;
  let fixture: ComponentFixture<ListPaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListPaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
