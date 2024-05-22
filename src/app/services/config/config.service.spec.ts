import { TestBed } from '@angular/core/testing';

import { ConfigService } from './config.service';


jest.mock('../../../assets/resources/config.json', () => ({
  __esModule: true,
  default: {},
}));
describe('ConfigService', () => {
  let service: ConfigService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
  });
  it('Should Create', () => {
    expect(service).toBeTruthy();
  });
  describe('With a Configuration (v1.0.0)', () => {
    beforeEach(() => {
      service['config'] = {
        homeTitle: 'TEST_TITLE',
        owner: 'TEST_OWNER',
        email: 'TEST_EMAIL',
        homeDescription: 'TEST_DESCRIPTION',
        menubarTitle: 'TEST_MENUBAR_TITLE',
        tabTitle: 'TEST_TAB_TITLE',
        link: 'TEST_LINK',
        analytics: {
          clarity: 'TEST_CLARITY',
          gtag: 'TEST_GTAG'
        },
        colors: {
          background: 'TEST_BACKGROUND',
          main: 'TEST_MAIN',
          secondary: 'TEST_SECONDARY',
          tertiary: 'TEST_TERTIARY',
          quaternary: 'TEST_QUATERNARY',
          light: {
            main: 'TEST_LIGHT_MAIN',
            secondary: 'TEST_LIGHT_SECONDARY',
            tertiary: 'TEST_LIGHT_TERTIARY',
            quaternary: 'TEST_LIGHT_QUATERNARY',
          },
        }
      };
    });
    test('get homeTitle()', () => {
      const spy = jest.spyOn(service, 'homeTitle', 'get');
      const homeTitle = service.homeTitle;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(homeTitle).toBe('TEST_TITLE');
    });
    test('get owner()', () => {
      const spy = jest.spyOn(service, 'owner', 'get');
      const owner = service.owner;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(owner).toBe('TEST_OWNER');
    });
    test('get email()', () => {
      const spy = jest.spyOn(service, 'email', 'get');
      const email = service.email;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(email).toBe('TEST_EMAIL');
    });
    test('get homeDescription()', () => {
      const spy = jest.spyOn(service, 'homeDescription', 'get');
      const homeDescription = service.homeDescription;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(homeDescription).toBe('TEST_DESCRIPTION');
    });
    test('get menubarTitle()', () => {
      const spy = jest.spyOn(service, 'menubarTitle', 'get');
      const menubarTitle = service.menubarTitle;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(menubarTitle).toBe('TEST_MENUBAR_TITLE');
    });
    test('get tabTitle()', () => {
      const spy = jest.spyOn(service, 'tabTitle', 'get');
      const tabTitle = service.tabTitle;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(tabTitle).toBe('TEST_TAB_TITLE');
    });
    describe('get link()', () => {
      test('without an ending /', () => {
        const spy = jest.spyOn(service, 'link', 'get');
        const link = service.link;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(link).toBe('TEST_LINK/');
      });
      test('with an ending /', () => {
        service['config']['link'] = 'TEST_LINK/';
        const spy = jest.spyOn(service, 'link', 'get');
        const link = service.link;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(link).toBe('TEST_LINK/');
      });
    });
    describe('get analytics()', () => {
      let spy: jest.SpyInstance;
      beforeEach(() => {
        spy = jest.spyOn(service, 'analytics', 'get');
      });
      test('gtag', () => {
        const gtag = service.analytics.gtag;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(gtag).toBe('TEST_GTAG');
      });
      test('clarity', () => {
        const clarity = service.analytics.clarity;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(clarity).toBe('TEST_CLARITY');
      });
    });
    describe('get colors()', () => {
      let spy: jest.SpyInstance;
      beforeEach(() => {
        spy = jest.spyOn(service, 'colors', 'get');
      });
      test('background', () => {
        const background = service.colors.background;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(background).toBe('TEST_BACKGROUND');
      });
      test('main', () => {
        const main = service.colors.main;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(main).toBe('TEST_MAIN');
      });
      test('secondary', () => {
        const secondary = service.colors.secondary;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(secondary).toBe('TEST_SECONDARY');
      });
      test('tertiary', () => {
        const tertiary = service.colors.tertiary;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(tertiary).toBe('TEST_TERTIARY');
      });
      test('quaternary', () => {
        const quaternary = service.colors.quaternary;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(quaternary).toBe('TEST_QUATERNARY');
      });
      describe('light', () => {
        test('main', () => {
          const main = service.colors.light!.main;
          expect(main).toBe('TEST_LIGHT_MAIN');
        });
        test('secondary', () => {
          const secondary = service.colors.light!.secondary;
          expect(secondary).toBe('TEST_LIGHT_SECONDARY');
        });
        test('tertiary', () => {
          const tertiary = service.colors.light!.tertiary;
          expect(tertiary).toBe('TEST_LIGHT_TERTIARY');
        });
        test('quaternary', () => {
          const quaternary = service.colors.light!.quaternary;
          expect(quaternary).toBe('TEST_LIGHT_QUATERNARY');
        });
      });
    });
  });
  describe('Without a Configuration', () => {
    test('get homeTitle()', () => {
      const spy = jest.spyOn(service, 'homeTitle', 'get');
      const homeTitle = service.homeTitle;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(homeTitle).toBe('');
    });
    test('get owner()', () => {
      const spy = jest.spyOn(service, 'owner', 'get');
      const owner = service.owner;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(owner).toBe('');
    });
    test('get email()', () => {
      const spy = jest.spyOn(service, 'email', 'get');
      const email = service.email;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(email).toBe('');
    });
    test('get homeDescription()', () => {
      const spy = jest.spyOn(service, 'homeDescription', 'get');
      const homeDescription = service.homeDescription;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(homeDescription).toBe('');
    });
    test('get menubarTitle()', () => {
      const spy = jest.spyOn(service, 'menubarTitle', 'get');
      const menubarTitle = service.menubarTitle;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(menubarTitle).toBe('');
    });
    test('get tabTitle()', () => {
      const spy = jest.spyOn(service, 'tabTitle', 'get');
      const tabTitle = service.tabTitle;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(tabTitle).toBe('');
    });
    test('get link()', () => {
      const spy = jest.spyOn(service, 'link', 'get');
      const link = service.link;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(link).toBe('');
    });
    test('get analytics()', () => {
      const spy = jest.spyOn(service, 'analytics', 'get');
      const analytics = service.analytics;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(analytics).toEqual({});
    });
    test('get colors()', () => {
      const spy = jest.spyOn(service, 'colors', 'get');
      const colors = service.colors;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(colors).toEqual({});
    });
  });
});
