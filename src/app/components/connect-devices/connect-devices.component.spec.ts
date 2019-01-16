import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectAdminDevicesComponent } from './connect-devices.component';

describe('ConnectDevicesComponent', () => {
  let component: ConnectAdminDevicesComponent;
  let fixture: ComponentFixture<ConnectAdminDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectAdminDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectAdminDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
