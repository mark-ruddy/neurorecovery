import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantLlComponent } from './instant-ll.component';

describe('InstantLlComponent', () => {
  let component: InstantLlComponent;
  let fixture: ComponentFixture<InstantLlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantLlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstantLlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
