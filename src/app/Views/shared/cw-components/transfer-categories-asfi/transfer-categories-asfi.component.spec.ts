import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCategoriesAsfiComponent } from './transfer-categories-asfi.component';

describe('TransferCategoriesAsfiComponent', () => {
  let component: TransferCategoriesAsfiComponent;
  let fixture: ComponentFixture<TransferCategoriesAsfiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferCategoriesAsfiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCategoriesAsfiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
