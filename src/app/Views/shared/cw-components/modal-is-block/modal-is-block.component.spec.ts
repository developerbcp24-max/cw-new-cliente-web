import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalIsBlockComponent } from './modal-is-block.component';

describe('ModalIsBlockComponent', () => {
  let component: ModalIsBlockComponent;
  let fixture: ComponentFixture<ModalIsBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalIsBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalIsBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
