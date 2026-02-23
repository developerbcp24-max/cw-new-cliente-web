import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalAccountDetailComponent } from './historical-account-detail.component';

describe('HistoricalAccountDetailComponent', () => {
  let component: HistoricalAccountDetailComponent;
  let fixture: ComponentFixture<HistoricalAccountDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoricalAccountDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalAccountDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
