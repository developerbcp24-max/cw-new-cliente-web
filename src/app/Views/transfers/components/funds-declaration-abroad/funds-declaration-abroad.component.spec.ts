import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundsDeclarationAbroadComponent } from './funds-declaration-abroad.component';

describe('FundsDeclarationAbroadComponent', () => {
  let component: FundsDeclarationAbroadComponent;
  let fixture: ComponentFixture<FundsDeclarationAbroadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FundsDeclarationAbroadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FundsDeclarationAbroadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
