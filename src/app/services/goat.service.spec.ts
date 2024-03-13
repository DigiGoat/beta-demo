import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GoatService } from './goat.service';


describe('GoatService', () => {
  let service: GoatService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(GoatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
