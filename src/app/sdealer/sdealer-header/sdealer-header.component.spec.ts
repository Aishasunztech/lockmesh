import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SdealerHeaderComponent } from './sdealer-header.component';

describe('SdealerHeaderComponent', () => {
  let component: SdealerHeaderComponent;
  let fixture: ComponentFixture<SdealerHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SdealerHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SdealerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
