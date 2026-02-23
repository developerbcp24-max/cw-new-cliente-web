import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedTicketComponent } from './depecrated-ticket.component';

describe('DepecratedTicketComponent', () => {
  let component: DepecratedTicketComponent;
  let fixture: ComponentFixture<DepecratedTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
