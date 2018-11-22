import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerLoginComponent } from './dealer-login.component';

describe('DealerLoginComponent', () => {
  let component: DealerLoginComponent;
  let fixture: ComponentFixture<DealerLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
