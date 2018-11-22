import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdealerComponent } from './sdealer.component';

describe('SdealerComponent', () => {
  let component: SdealerComponent;
  let fixture: ComponentFixture<SdealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
