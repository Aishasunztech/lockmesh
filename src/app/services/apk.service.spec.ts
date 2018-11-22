import { TestBed, inject } from '@angular/core/testing';

import { ApkService } from './apk.service';

describe('ApkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApkService]
    });
  });

  it('should be created', inject([ApkService], (service: ApkService) => {
    expect(service).toBeTruthy();
  }));
});
