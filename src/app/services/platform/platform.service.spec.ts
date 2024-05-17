import { TestBed } from '@angular/core/testing';
import { PlatformService } from './platform.service';

describe('PlatformService', () => {
  let service: PlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have isServer property', () => {
    expect(service.isServer).toBeDefined();
  });

  it('should have isBrowser property', () => {
    expect(service.isBrowser).toBeDefined();
  });

  it('should have isBot property', () => {
    expect(service.isBot).toBeDefined();
  });

  it('should have isDev property', () => {
    expect(service.isDev).toBeDefined();
  });
});
