import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantComponent } from './instant.component';

describe('InstantComponent', () => {
  let component: InstantComponent;
  let fixture: ComponentFixture<InstantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
