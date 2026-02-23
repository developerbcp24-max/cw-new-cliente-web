import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhatsAppIaComponent } from './whats-app-ia.component';

describe('WhatsAppIaComponent', () => {
  let component: WhatsAppIaComponent;
  let fixture: ComponentFixture<WhatsAppIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhatsAppIaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhatsAppIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
