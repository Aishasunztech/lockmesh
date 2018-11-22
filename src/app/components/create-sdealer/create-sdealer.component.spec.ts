import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSdealerComponent } from './create-sdealer.component';

describe('CreateSdealerComponent', () => {
  let component: CreateSdealerComponent;
  let fixture: ComponentFixture<CreateSdealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSdealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSdealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
