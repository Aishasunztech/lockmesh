import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerHeaderComponent } from './dealer-header.component';

describe('DealerHeaderComponent', () => {
  let component: DealerHeaderComponent;
  let fixture: ComponentFixture<DealerHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
