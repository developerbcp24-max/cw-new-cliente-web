import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalAccountsComponent } from './historical-accounts.component';

describe('HistoricalAccountsComponent', () => {
  let component: HistoricalAccountsComponent;
  let fixture: ComponentFixture<HistoricalAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
