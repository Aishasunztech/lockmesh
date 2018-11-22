import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdealerClientComponent } from './sdealer-client.component';

describe('SdealerClientComponent', () => {
  let component: SdealerClientComponent;
  let fixture: ComponentFixture<SdealerClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdealerClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdealerClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
