import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDealerSdealerComponent } from './create-dealer-sdealer.component';

describe('CreateDealerSdealerComponent', () => {
  let component: CreateDealerSdealerComponent;
  let fixture: ComponentFixture<CreateDealerSdealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateDealerSdealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateDealerSdealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
