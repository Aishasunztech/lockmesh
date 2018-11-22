import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdealerLoginComponent } from './sdealer-login.component';

describe('SdealerLoginComponent', () => {
  let component: SdealerLoginComponent;
  let fixture: ComponentFixture<SdealerLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdealerLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdealerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
