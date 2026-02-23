import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalAccountListComponent } from './historical-account-list.component';

describe('HistoricalAccountListComponent', () => {
  let component: HistoricalAccountListComponent;
  let fixture: ComponentFixture<HistoricalAccountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalAccountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
