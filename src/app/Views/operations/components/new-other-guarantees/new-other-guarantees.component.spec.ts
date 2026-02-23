import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOtherGuaranteesComponent } from './new-other-guarantees.component';

describe('NewOtherGuaranteesComponent', () => {
  let component: NewOtherGuaranteesComponent;
  let fixture: ComponentFixture<NewOtherGuaranteesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewOtherGuaranteesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOtherGuaranteesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
