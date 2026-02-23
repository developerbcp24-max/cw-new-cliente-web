import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedMyAccountsComponent } from './depecrated-my-accounts.component';

describe('DepecratedMyAccountsComponent', () => {
  let component: DepecratedMyAccountsComponent;
  let fixture: ComponentFixture<DepecratedMyAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedMyAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedMyAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
