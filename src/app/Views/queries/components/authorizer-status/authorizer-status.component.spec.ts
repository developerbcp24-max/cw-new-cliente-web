import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizerStatusComponent } from './authorizer-status.component';

describe('AuthorizerStatusComponent', () => {
  let component: AuthorizerStatusComponent;
  let fixture: ComponentFixture<AuthorizerStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizerStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorizerStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
