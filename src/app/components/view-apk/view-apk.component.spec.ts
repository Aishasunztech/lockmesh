import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewApkComponent } from './view-apk.component';

describe('ViewApkComponent', () => {
  let component: ViewApkComponent;
  let fixture: ComponentFixture<ViewApkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewApkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewApkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
