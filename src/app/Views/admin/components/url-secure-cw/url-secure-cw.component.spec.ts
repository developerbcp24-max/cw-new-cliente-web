import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlSecureCwComponent } from './url-secure-cw.component';

describe('UrlSecureCwComponent', () => {
  let component: UrlSecureCwComponent;
  let fixture: ComponentFixture<UrlSecureCwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UrlSecureCwComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlSecureCwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
