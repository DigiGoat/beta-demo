import type { ConfigService } from './config.service';

export const ConfigServiceMock = {
  homeTitle: 'TEST_TITLE',
  owner: 'TEST_OWNER',
  email: 'TEST_EMAIL',
  homeDescription: 'TEST_DESCRIPTION',
  menubarTitle: 'TEST_MENUBAR_TITLE',
  tabTitle: 'TEST_TAB_TITLE',
  link: 'https://TEST.LINK',
  analytics: {
    clarity: 'TEST_CLARITY',
    gtag: 'TEST_GTAG'
  },
  colors: {
    background: 'wood',
    main: 'TEST_MAIN',
    secondary: 'TEST_SECONDARY',
    tertiary: 'TEST_TERTIARY',
    quaternary: 'TEST_QUATERNARY',
    light: {
      main: 'TEST_MAIN_LIGHT',
      secondary: 'TEST_SECONDARY_LIGHT',
      tertiary: 'TEST_TERTIARY_LIGHT',
      quaternary: 'TEST_QUATERNARY_LIGHT'
    }

  }
} as ConfigService;
export const EmptyConfigServiceMock = {
  homeTitle: '',
  owner: '',
  email: '',
  homeDescription: '',
  menubarTitle: '',
  tabTitle: '',
  link: '',
  analytics: {},
  colors: {}
} as ConfigService;
