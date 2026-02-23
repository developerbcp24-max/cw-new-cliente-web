import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiInfoEnrquecidaComponent } from './api-info-enrquecida.component';

describe('ApiInfoEnrquecidaComponent', () => {
  let component: ApiInfoEnrquecidaComponent;
  let fixture: ComponentFixture<ApiInfoEnrquecidaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApiInfoEnrquecidaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiInfoEnrquecidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
