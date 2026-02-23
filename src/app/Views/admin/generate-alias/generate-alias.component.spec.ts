import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateAliasComponent } from './generate-alias.component';

describe('GenerateAliasComponent', () => {
  let component: GenerateAliasComponent;
  let fixture: ComponentFixture<GenerateAliasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenerateAliasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateAliasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
