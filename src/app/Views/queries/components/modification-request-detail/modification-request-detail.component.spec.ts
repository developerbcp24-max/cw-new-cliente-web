import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationRequestDetailComponent } from './modification-request-detail.component';

describe('ModificationRequestDetailComponent', () => {
  let component: ModificationRequestDetailComponent;
  let fixture: ComponentFixture<ModificationRequestDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificationRequestDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificationRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
