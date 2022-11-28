import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantUlComponent } from './instant-ul.component';

describe('InstantUlComponent', () => {
  let component: InstantUlComponent;
  let fixture: ComponentFixture<InstantUlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantUlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstantUlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
