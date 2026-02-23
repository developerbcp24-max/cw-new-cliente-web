import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCreditCardsComponent } from './search-credit-cards.component';

describe('SearchCreditCardsComponent', () => {
  let component: SearchCreditCardsComponent;
  let fixture: ComponentFixture<SearchCreditCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchCreditCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCreditCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
