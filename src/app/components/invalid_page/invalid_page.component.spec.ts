import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidPage } from './invalid_page.component';

describe('InvalidPage', () => {
  let component: InvalidPage;
  let fixture: ComponentFixture<InvalidPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvalidPage ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
