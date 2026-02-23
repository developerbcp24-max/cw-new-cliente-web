import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoedataComponent } from './roedata.component';

describe('RoedataComponent', () => {
  let component: RoedataComponent;
  let fixture: ComponentFixture<RoedataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoedataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoedataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
