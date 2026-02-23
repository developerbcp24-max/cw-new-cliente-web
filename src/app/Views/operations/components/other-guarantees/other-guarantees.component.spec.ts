import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherGuaranteesComponent } from './other-guarantees.component';

describe('OtherGuaranteesComponent', () => {
  let component: OtherGuaranteesComponent;
  let fixture: ComponentFixture<OtherGuaranteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherGuaranteesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherGuaranteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
