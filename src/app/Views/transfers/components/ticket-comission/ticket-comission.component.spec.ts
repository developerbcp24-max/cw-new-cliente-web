import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketComissionComponent } from './ticket-comission.component';

describe('TicketComissionComponent', () => {
  let component: TicketComissionComponent;
  let fixture: ComponentFixture<TicketComissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketComissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketComissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
