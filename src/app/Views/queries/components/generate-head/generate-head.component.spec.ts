import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateHeadComponent } from './generate-head.component';

describe('GenerateHeadComponent', () => {
  let component: GenerateHeadComponent;
  let fixture: ComponentFixture<GenerateHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateHeadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
