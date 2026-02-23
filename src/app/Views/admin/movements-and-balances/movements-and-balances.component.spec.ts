import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementsAndBalancesComponent } from './movements-and-balances.component';

describe('MovementsAndBalancesComponent', () => {
  let component: MovementsAndBalancesComponent;
  let fixture: ComponentFixture<MovementsAndBalancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovementsAndBalancesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovementsAndBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
