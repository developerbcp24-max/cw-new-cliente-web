import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepecratedSourceAccountsComponent } from './depecrated-source-accounts.component';

describe('DepecratedSourceAccountsComponent', () => {
  let component: DepecratedSourceAccountsComponent;
  let fixture: ComponentFixture<DepecratedSourceAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepecratedSourceAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepecratedSourceAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
