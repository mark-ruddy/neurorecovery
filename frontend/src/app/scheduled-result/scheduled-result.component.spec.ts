import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledResultComponent } from './scheduled-result.component';

describe('ScheduledResultComponent', () => {
  let component: ScheduledResultComponent;
  let fixture: ComponentFixture<ScheduledResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduledResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduledResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
