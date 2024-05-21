import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigServiceMock, EmptyConfigServiceMock } from '../../services/config/config.service.mock';
import type { PlatformService } from '../../services/platform/platform.service';
import { AnalyticsComponent } from './analytics.component';
const clarity = jest.fn();
const gtag = jest.fn();
describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;
  const document = {
    createElement: jest.fn(() => { return { innerHTML: '' }; }), createComment: jest.fn(), head: { appendChild: jest.fn() }, documentElement: { getAttribute: jest.fn(() => 'dark') }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    component['document'] = document as unknown as Document;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  describe('With a config', () => {
    beforeEach(() => {
      component['config'] = ConfigServiceMock;
    });
    describe('In Dev Mode', () => {
      beforeEach(() => {
        component['platformService'] = { isServer: true, isBrowser: false, isDev: true } as PlatformService;
        fixture.detectChanges();
      });
      it('should disable analytics', () => {
        expect(document.createComment).toHaveBeenCalledTimes(1);
        expect(document.head.appendChild).toHaveBeenCalledTimes(1);
      });
    });
    describe('On the server', () => {
      beforeEach(() => {
        component['platformService'] = { isServer: true, isBrowser: false, isDev: false } as PlatformService;
        fixture.detectChanges();
      });
      it('should add Clarity script', () => {
        expect(document.createElement).toHaveBeenCalled();
        expect(document.createElement).toHaveBeenCalledWith('script');
        expect(document.head.appendChild).toHaveBeenCalled();
        expect(document.head.appendChild).toHaveBeenCalledWith({ innerHTML: expect.stringContaining('TEST_CLARITY') });
      });
      it('should add gtag scripts', () => {
        expect(document.createElement).toHaveBeenCalled();
        expect(document.createElement).toHaveBeenCalledWith('script');
        expect(document.head.appendChild).toHaveBeenCalled();
        expect(document.head.appendChild).toHaveBeenCalledWith({ innerHTML: '', async: true, src: expect.stringContaining('TEST_GTAG') });
        expect(document.head.appendChild).toHaveBeenCalledWith({ innerHTML: expect.stringContaining('function gtag()') });
      });
    });
    describe('In the Browser', () => {
      beforeEach(() => {
        component['platformService'] = { isServer: false, isBrowser: true, isDev: false } as PlatformService;
        (window as unknown as { clarity: object; }).clarity = clarity;
        (window as unknown as { gtag: object; }).gtag = gtag;
      });
      it('should configure clarity', () => {
        fixture.detectChanges();
        expect(clarity).toHaveBeenCalledTimes(1);
        expect(clarity).toHaveBeenCalledWith('set', 'Color Scheme', 'Dark');
      });
      it('should configure gtag', () => {
        document.documentElement.getAttribute.mockReturnValue('light');
        fixture.detectChanges();
        expect(gtag).toHaveBeenCalledTimes(3);
        expect(gtag).toHaveBeenNthCalledWith(1, 'set', 'Color Scheme', 'Light');
        expect(gtag).toHaveBeenNthCalledWith(2, 'js', expect.any(Date));
        expect(gtag).toHaveBeenNthCalledWith(3, 'config', 'TEST_GTAG', { send_page_view: false });
      });
    });
  });
  describe('Without a config', () => {
    beforeEach(() => {
      component['config'] = EmptyConfigServiceMock;
      delete (window as unknown as { clarity?: object; }).clarity;
      delete (window as unknown as { gtag?: object; }).gtag;
      fixture.detectChanges();
    });
    describe('On the server', () => {
      beforeEach(() => {
        component['platformService'] = { isServer: true, isBrowser: false, isDev: false } as PlatformService;
        fixture.detectChanges();
      });
      it('should not add scripts', () => {
        expect(document.createElement).toHaveBeenCalledTimes(0);
        expect(document.head.appendChild).toHaveBeenCalledTimes(0);
      });
    });
    describe('In the Browser', () => {
      beforeEach(() => {
        component['platformService'] = { isServer: false, isBrowser: true, isDev: false } as PlatformService;
        fixture.detectChanges();
      });
      it('should not configure clarity', () => {
        expect(clarity).not.toHaveBeenCalled();
      });
      it('should configure gtag', () => {
        expect(gtag).not.toHaveBeenCalled();
      });
    });
  });
});
