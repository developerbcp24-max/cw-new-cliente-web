import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCodeComponent } from './client-code.component';

describe('ClientCodeComponent', () => {
  let component: ClientCodeComponent;
  let fixture: ComponentFixture<ClientCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
