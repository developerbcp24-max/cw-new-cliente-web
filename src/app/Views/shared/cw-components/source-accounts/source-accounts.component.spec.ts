import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceAccountsComponent } from './source-accounts.component';

describe('SourceAccountsComponent', () => {
  let component: SourceAccountsComponent;
  let fixture: ComponentFixture<SourceAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourceAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
