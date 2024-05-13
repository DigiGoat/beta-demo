import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GoatService, type Goat } from './goat.service';


describe('GoatService', () => {
  let service: GoatService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(GoatService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('public does', () => {
    beforeAll(() => expect(service.does).toBeTruthy());
    it('should return an Observable array', () => {
      const testData = [{}, {}, {}, {}, {}];
      service.does.subscribe(data =>
        expect(data).toEqual(testData)
      );
      const req = http.expectOne('./assets/resources/does.json');
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    });
    it('should retry failed requests 3 times', () => {
      const testData = [{}, {}, {}, {}, {}];
      service.does.subscribe(data =>
        expect(data).toEqual(testData)
      );
      let req = http.expectOne('./assets/resources/does.json');
      req.flush('Deliberate Error', { status: 404, statusText: 'Not Found' });
      req = http.expectOne('./assets/resources/does.json');
      req.flush('Deliberate Error', { status: 0, statusText: 'Network Error' });
      req = http.expectOne('./assets/resources/does.json');
      req.flush(testData);
    });
    it('should handle server errors', () => {
      service.does.subscribe({
        error: err => {
          expect(err.status).toEqual(404);
          expect(err.statusText).toEqual('Not Found');
          expect(err.error).toEqual('Deliberate Error');
        }
      }
      );

      for (let i = 0; i < 4; i++) {
        const req = http.expectOne('./assets/resources/does.json');
        req.flush('Deliberate Error', { status: 404, statusText: 'Not Found' });
      }
    });
    it('should handle client errors', () => {
      service.does.subscribe({
        error: err => {
          expect(err.status).toEqual(0);
          expect(err.statusText).toEqual('Network Error');
          expect(err.error).toEqual('Deliberate Error');
        }
      }
      );

      for (let i = 0; i < 4; i++) {
        const req = http.expectOne('./assets/resources/does.json');
        req.flush('Deliberate Error', { status: 0, statusText: 'Network Error' });
      }
    });
    it('should cache does after first request', () => {
      const testData = [{}, {}, {}, {}, {}];

      service['_does'] = testData as Goat[];
      service.does.subscribe(data =>
        expect(data).toEqual(testData)
      );
      http.expectNone('./assets/resources/does.json');
    });
    it('should ignore cache if empty (even if previous request succeeded)', () => {
      const testData = [{}, {}, {}, {}, {}];
      service.does.subscribe(data =>
        expect(data).toEqual([])
      );
      const req = http.expectOne('./assets/resources/does.json');
      expect(req.request.method).toEqual('GET');
      req.flush([]);
      service.does.subscribe(data =>
        expect(data).toEqual(testData)
      );
      const req2 = http.expectOne('./assets/resources/does.json');
      expect(req2.request.method).toEqual('GET');
      req2.flush(testData);
    });
    afterEach(() => {
      http.verify();
    });

  });
  //Same as the test above, but with bucks
  describe('public bucks', () => {
    beforeAll(() => expect(service.bucks).toBeTruthy());

    it('should return an Observable array', () => {
      const testData = [{}, {}, {}, {}, {}];
      service.bucks.subscribe(data =>
        expect(data).toEqual(testData)
      );
      const req = http.expectOne('./assets/resources/bucks.json');
      expect(req.request.method).toEqual('GET');
      req.flush(testData);
    });

    it('should retry failed requests 3 times', () => {
      const testData = [{}, {}, {}, {}, {}];
      service.bucks.subscribe(data =>
        expect(data).toEqual(testData)
      );
      let req = http.expectOne('./assets/resources/bucks.json');
      req.flush('Deliberate Error', { status: 404, statusText: 'Not Found' });
      req = http.expectOne('./assets/resources/bucks.json');
      req.flush('Deliberate Error', { status: 0, statusText: 'Network Error' });
      req = http.expectOne('./assets/resources/bucks.json');
      req.flush(testData);
    });

    it('should handle server errors', () => {
      service.bucks.subscribe({
        error: err => {
          expect(err.status).toEqual(404);
          expect(err.statusText).toEqual('Not Found');
          expect(err.error).toEqual('Deliberate Error');
        }
      });

      for (let i = 0; i < 4; i++) {
        const req = http.expectOne('./assets/resources/bucks.json');
        req.flush('Deliberate Error', { status: 404, statusText: 'Not Found' });
      }
    });

    it('should handle client errors', () => {
      service.bucks.subscribe({
        error: err => {
          expect(err.status).toEqual(0);
          expect(err.statusText).toEqual('Network Error');
          expect(err.error).toEqual('Deliberate Error');
        }
      });

      for (let i = 0; i < 4; i++) {
        const req = http.expectOne('./assets/resources/bucks.json');
        req.flush('Deliberate Error', { status: 0, statusText: 'Network Error' });
      }
    });

    it('should cache bucks after first request', () => {
      const testData = [{}, {}, {}, {}, {}];

      service['_bucks'] = testData as Goat[];
      service.bucks.subscribe(data =>
        expect(data).toEqual(testData)
      );
      http.expectNone('./assets/resources/bucks.json');
    });

    it('should ignore cache if empty (even if previous request succeeded)', () => {
      const testData = [{}, {}, {}, {}, {}];
      service.bucks.subscribe(data =>
        expect(data).toEqual([])
      );
      const req = http.expectOne('./assets/resources/bucks.json');
      expect(req.request.method).toEqual('GET');
      req.flush([]);
      service.bucks.subscribe(data =>
        expect(data).toEqual(testData)
      );
      const req2 = http.expectOne('./assets/resources/bucks.json');
      expect(req2.request.method).toEqual('GET');
      req2.flush(testData);
    });

    afterEach(() => {
      http.verify();
    });
  });
});
