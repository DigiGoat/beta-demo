import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigServiceMock, EmptyConfigServiceMock } from '../../services/config/config.service.mock';
import type { PlatformService } from '../../services/platform/platform.service';
import { AnalyticsComponent } from './analytics.component';
const clarity = jest.fn();
const gtag = jest.fn();
describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;
  let html: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
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
        component['platformService'] = { isServer: false, isBrowser: true, isDev: true } as PlatformService;
        fixture.detectChanges();
      });
      it('should disable analytics', () => {
        expect(html.innerHTML).toContain('Analytics disabled in development mode');
      });
      it('should match the snapshot', () => {
        expect(fixture).toMatchSnapshot();
      });
    });
    describe('On the server', () => {
      beforeEach(() => {
        component['platformService'] = { isServer: true, isBrowser: false, isDev: false } as PlatformService;
        fixture.detectChanges();
      });
      it('should add Clarity script', () => {
        const elements = html.querySelectorAll('script');
        const script = Array.from(elements).filter((el) => el.innerHTML.includes('clarity'));
        expect(script).toHaveLength(1);
      });
      it('should add gtag scripts', () => {
        const elements = html.querySelectorAll('script');
        const script = Array.from(elements).filter((el) => el.innerHTML.includes('gtag') || el.src.includes('gtag'));
        expect(script).toHaveLength(2);
      });
      it('should match the snapshot', () => {
        expect(fixture).toMatchSnapshot();
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
        jest.spyOn(window, 'matchMedia').mockImplementation(() => false as unknown as MediaQueryList);
        fixture.detectChanges();
        expect(gtag).toHaveBeenCalledTimes(3);
        expect(gtag).toHaveBeenNthCalledWith(1, 'set', 'Color Scheme', 'Light');
        expect(gtag).toHaveBeenNthCalledWith(2, 'js', expect.any(Date));
        expect(gtag).toHaveBeenNthCalledWith(3, 'config', 'TEST_GTAG', { send_page_view: false });
      });
      it('should match the snapshot', () => {
        expect(fixture).toMatchSnapshot();
      });
    });
  });
  describe('Without a config', () => {
    beforeEach(() => {
      component['config'] = EmptyConfigServiceMock;
      fixture.detectChanges();
      html = fixture.nativeElement;
    });
    describe('On the server', () => {
      beforeEach(() => {
        component['platformService'] = { isServer: true, isBrowser: false, isDev: false } as PlatformService;
        fixture.detectChanges();
      });
      it('should not add scripts', () => {
        const elements = html.querySelectorAll('script');
        expect(elements).toHaveLength(0);
      });
      it('should match the snapshot', () => {
        expect(fixture).toMatchSnapshot();
      });
    });
    describe('In the Browser', () => {
      beforeEach(() => {
        component['platformService'] = { isServer: false, isBrowser: true, isDev: false } as PlatformService;
        (window as unknown as { clarity: object; }).clarity = clarity;
        (window as unknown as { gtag: object; }).gtag = gtag;
        fixture.detectChanges();
      });
      it('should not configure clarity', () => {
        expect(clarity).not.toHaveBeenCalled();
      });
      it('should configure gtag', () => {
        expect(gtag).not.toHaveBeenCalled();
      });
      it('should match the snapshot', () => {
        expect(fixture).toMatchSnapshot();
      });
    });
  });
});
