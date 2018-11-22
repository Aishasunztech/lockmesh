import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerCreateSdealerComponent } from './dealer-create-sdealer.component';

describe('DealerCreateSdealerComponent', () => {
  let component: DealerCreateSdealerComponent;
  let fixture: ComponentFixture<DealerCreateSdealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerCreateSdealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerCreateSdealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
