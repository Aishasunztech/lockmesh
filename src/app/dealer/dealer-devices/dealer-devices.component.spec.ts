import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerDevicesComponent } from './dealer-devices.component';

describe('DealerDevicesComponent', () => {
  let component: DealerDevicesComponent;
  let fixture: ComponentFixture<DealerDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
