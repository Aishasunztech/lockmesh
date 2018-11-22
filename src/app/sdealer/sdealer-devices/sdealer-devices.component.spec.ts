import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdealerDevicesComponent } from './sdealer-devices.component';

describe('SdealerDevicesComponent', () => {
  let component: SdealerDevicesComponent;
  let fixture: ComponentFixture<SdealerDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdealerDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdealerDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
