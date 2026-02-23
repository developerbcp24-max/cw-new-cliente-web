import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalBalancesComponent } from './total-balances.component';

describe('TotalBalancesComponent', () => {
  let component: TotalBalancesComponent;
  let fixture: ComponentFixture<TotalBalancesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotalBalancesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalBalancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
