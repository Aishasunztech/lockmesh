import { TestBed, inject } from '@angular/core/testing';

import { GlobalSearchService } from './global-search.service';

describe('GlobalSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GlobalSearchService]
    });
  });

  it('should be created', inject([GlobalSearchService], (service: GlobalSearchService) => {
    expect(service).toBeTruthy();
  }));
});
