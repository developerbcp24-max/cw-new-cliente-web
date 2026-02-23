import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewLoaderComponent } from './new-loader.component';

describe('NewLoaderComponent', () => {
  let component: NewLoaderComponent;
  let fixture: ComponentFixture<NewLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
