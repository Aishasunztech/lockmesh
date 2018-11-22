import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerSDealerComponent } from './dealer-s-dealer.component';

describe('DealerSDealerComponent', () => {
  let component: DealerSDealerComponent;
  let fixture: ComponentFixture<DealerSDealerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerSDealerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerSDealerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
