import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YpfbComponent } from './ypfb.component';

describe('YpfbComponent', () => {
  let component: YpfbComponent;
  let fixture: ComponentFixture<YpfbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YpfbComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YpfbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
