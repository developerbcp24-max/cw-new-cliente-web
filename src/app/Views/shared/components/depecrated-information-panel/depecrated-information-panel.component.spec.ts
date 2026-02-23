import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedInformationPanelComponent } from './depecrated-information-panel.component';

describe('DepecratedInformationPanelComponent', () => {
  let component: DepecratedInformationPanelComponent;
  let fixture: ComponentFixture<DepecratedInformationPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedInformationPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedInformationPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
