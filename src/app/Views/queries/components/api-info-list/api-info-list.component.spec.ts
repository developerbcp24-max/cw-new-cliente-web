import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiInfoListComponent } from './api-info-list.component';

describe('ApiInfoListComponent', () => {
  let component: ApiInfoListComponent;
  let fixture: ComponentFixture<ApiInfoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiInfoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
