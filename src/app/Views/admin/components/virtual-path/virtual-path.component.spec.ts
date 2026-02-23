import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualPathComponent } from './virtual-path.component';

describe('VirtualPathComponent', () => {
  let component: VirtualPathComponent;
  let fixture: ComponentFixture<VirtualPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VirtualPathComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VirtualPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
