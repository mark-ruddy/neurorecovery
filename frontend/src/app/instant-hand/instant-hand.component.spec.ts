import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantHandComponent } from './instant-hand.component';

describe('InstantHandComponent', () => {
  let component: InstantHandComponent;
  let fixture: ComponentFixture<InstantHandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantHandComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstantHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
