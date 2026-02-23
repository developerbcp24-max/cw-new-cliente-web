import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateKeyComponent } from './generate-key.component';

describe('GenerateKeyComponent', () => {
  let component: GenerateKeyComponent;
  let fixture: ComponentFixture<GenerateKeyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateKeyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateKeyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
