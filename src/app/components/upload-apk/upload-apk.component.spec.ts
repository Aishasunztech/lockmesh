import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadApkComponent } from './upload-apk.component';

describe('UploadApkComponent', () => {
  let component: UploadApkComponent;
  let fixture: ComponentFixture<UploadApkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadApkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadApkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
