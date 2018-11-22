import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdealerAddDevicesComponent } from './sdealer-add-devices.component';

describe('SdealerAddDevicesComponent', () => {
  let component: SdealerAddDevicesComponent;
  let fixture: ComponentFixture<SdealerAddDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdealerAddDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdealerAddDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
