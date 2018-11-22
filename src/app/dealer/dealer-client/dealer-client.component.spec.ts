import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerClientComponent } from './dealer-client.component';

describe('DealerClientComponent', () => {
  let component: DealerClientComponent;
  let fixture: ComponentFixture<DealerClientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealerClientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealerClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
