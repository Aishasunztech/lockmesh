import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SConnectDevicesComponent } from './s-connect-devices.component';

describe('SConnectDevicesComponent', () => {
  let component: SConnectDevicesComponent;
  let fixture: ComponentFixture<SConnectDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SConnectDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SConnectDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
