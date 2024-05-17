import type { Meta, Title } from '@angular/platform-browser';
import type { RouterStateSnapshot } from '@angular/router';
import { ConfigServiceMock, EmptyConfigServiceMock } from '../services/config/config.service.mock';
import type { PlatformService } from '../services/platform/platform.service';
import { TitleStrategy } from './title.strategy';

describe('TitleStrategy', () => {
  let strategy: TitleStrategy;
  beforeEach(() => {
    const title = { setTitle: jest.fn() } as unknown as Title;
    const configService = ConfigServiceMock;
    const meta = { getTags: jest.fn().mockReturnValue(['TEST_TAG']), removeTagElement: jest.fn(), addTags: jest.fn() } as unknown as Meta;
    const platform = { isBrowser: true, isDev: false } as unknown as PlatformService;
    strategy = new TitleStrategy(title, configService, meta, platform);
    jest.spyOn(strategy, 'buildTitle').mockReturnValue('TEST_TITLE');
  });
  it('should create', () => {
    expect(strategy).toBeTruthy();
  });
  describe('With a Config', () => {
    it('should set the title', () => {
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(strategy['title'].setTitle).toHaveBeenCalledWith('TEST_TITLE · TEST_TAB_TITLE');
    });
    it('should set dynamic titles', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue(':TEST - TEST_TITLE');
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [{ params: { TEST: 'TEST_PREFIX' }, children: [] }] } } as unknown as RouterStateSnapshot);
      expect(strategy['title'].setTitle).toHaveBeenCalledWith('TEST_PREFIX · TEST_TITLE · TEST_TAB_TITLE');
    });
    it('should set nested dynamic titles', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue(':TEST - TEST_TITLE');
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [{ children: [{ children: [{ children: [], params: { TEST: 'TEST_PREFIX' } }] }] }] } } as unknown as RouterStateSnapshot);
      expect(strategy['title'].setTitle).toHaveBeenCalledWith('TEST_PREFIX · TEST_TITLE · TEST_TAB_TITLE');
    });
    it('should return the dynamic param if not found', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue(':TEST - TEST_TITLE');
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(strategy['title'].setTitle).toHaveBeenCalledWith(':TEST · TEST_TITLE · TEST_TAB_TITLE');
    });
    it('should return tabTitle if no title provided', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue(undefined);
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(strategy['title'].setTitle).toHaveBeenCalledWith('TEST_TAB_TITLE');
    });
    it('should get old meta tags', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue(undefined);
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(strategy['meta'].getTags).toHaveBeenCalledTimes(strategy['tags'].length);
    });
    it('should remove old meta tags', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue(undefined);
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(strategy['meta'].removeTagElement).toHaveBeenCalledTimes(strategy['tags'].length);
    });
    it('should add new meta tags', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue('TEST_TITLE');
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(strategy['meta'].addTags).toHaveBeenCalledTimes(1);
      expect(strategy['meta'].addTags).toHaveBeenCalledWith([{ 'content': 'TEST_TITLE', 'name': 'og:title' }, { 'content': 'https://test.link/TEST_URL', 'name': 'og:url' }, { 'content': 'TEST_TITLE', 'name': 'og:site_name' }, { 'content': 'website', 'name': 'og:type' }]);
    });
  });
  describe('Without a Config', () => {
    beforeEach(() => {
      strategy['configService'] = EmptyConfigServiceMock;
    });
    it('should set the title', () => {
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(strategy['title'].setTitle).toHaveBeenCalledWith('TEST_TITLE');
    });
    it('should set dynamic titles', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue(':TEST - TEST_TITLE');
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [{ params: { TEST: 'TEST_PREFIX' }, children: [] }] } } as unknown as RouterStateSnapshot);
      expect(strategy['title'].setTitle).toHaveBeenCalledWith('TEST_PREFIX · TEST_TITLE');
    });
    it('should set nested dynamic titles', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue(':TEST - TEST_TITLE');
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [{ children: [{ children: [{ children: [], params: { TEST: 'TEST_PREFIX' } }] }] }] } } as unknown as RouterStateSnapshot);
      expect(strategy['title'].setTitle).toHaveBeenCalledWith('TEST_PREFIX · TEST_TITLE');
    });
    it('should return the dynamic param if not found', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue(':TEST - TEST_TITLE');
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(strategy['title'].setTitle).toHaveBeenCalledWith(':TEST · TEST_TITLE');
    });
    it('should return tabTitle if no title provided', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue('');
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(strategy['title'].setTitle).toHaveBeenCalledWith('');
    });
    it('should get old meta tags', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue(undefined);
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(strategy['meta'].getTags).toHaveBeenCalledTimes(strategy['tags'].length);
    });
    it('should remove old meta tags', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue(undefined);
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(strategy['meta'].removeTagElement).toHaveBeenCalledTimes(strategy['tags'].length);
    });
    it('should add new meta tags', () => {
      jest.spyOn(strategy, 'buildTitle').mockReturnValue('TEST_TITLE');
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(strategy['meta'].addTags).toHaveBeenCalledTimes(1);
      expect(strategy['meta'].addTags).toHaveBeenCalledWith([{ 'content': 'TEST_TITLE', 'name': 'og:title' }, { 'content': 'TEST_URL', 'name': 'og:url' }, { 'content': '', 'name': 'og:site_name' }, { 'content': 'website', 'name': 'og:type' }]);
    });
  });
  describe('Analytics', () => {
    const gtag = jest.fn();
    beforeEach(() => {
      (window as unknown as { gtag: jest.Mock; }).gtag = gtag;
    });
    it('Should send page views if gtag is configured', () => {
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(gtag).toHaveBeenCalledTimes(1);
      expect(gtag).toHaveBeenCalledWith('event', 'page_view', { page_path: 'TEST_URL' });
    });
    it('Should not send page views if gtag is unconfigured', () => {
      delete (window as unknown as { gtag?: jest.Mock; }).gtag;
      strategy.updateTitle({ url: 'TEST_URL', root: { children: [] } } as unknown as RouterStateSnapshot);
      expect(gtag).toHaveBeenCalledTimes(0);
    });
  });
});
