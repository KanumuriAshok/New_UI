import { TestBed } from '@angular/core/testing';

import { GisfileuploadfireService } from './gisfileuploadfire.service';

describe('GisfileuploadfireService', () => {
  let service: GisfileuploadfireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GisfileuploadfireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
