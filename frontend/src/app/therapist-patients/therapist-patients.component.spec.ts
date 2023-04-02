import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TherapistPatientsComponent } from './therapist-patients.component';

describe('TherapistPatientsComponent', () => {
  let component: TherapistPatientsComponent;
  let fixture: ComponentFixture<TherapistPatientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TherapistPatientsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TherapistPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
