import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerAddDevicesComponent } from './dealer-add-devices.component';

describe('DealerAddDevicesComponent', () => {
  let component: DealerAddDevicesComponent;
  let fixture: ComponentFixture<DealerAddDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerAddDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerAddDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
