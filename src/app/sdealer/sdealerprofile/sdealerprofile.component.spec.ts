import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdealerprofileComponent } from './sdealerprofile.component';

describe('SdealerprofileComponent', () => {
  let component: SdealerprofileComponent;
  let fixture: ComponentFixture<SdealerprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdealerprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdealerprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
