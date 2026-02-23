import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BanksSearcherComponent } from './banks-searcher.component';

describe('BanksSearcherComponent', () => {
  let component: BanksSearcherComponent;
  let fixture: ComponentFixture<BanksSearcherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BanksSearcherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BanksSearcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
