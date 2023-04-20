import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatlabRdpComponent } from './matlab-rdp.component';

describe('MatlabRdpComponent', () => {
  let component: MatlabRdpComponent;
  let fixture: ComponentFixture<MatlabRdpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatlabRdpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatlabRdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
