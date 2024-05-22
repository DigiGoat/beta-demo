import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { Meta } from '@angular/platform-browser';
import type { ConfigService } from '../../services/config/config.service';
import { ConfigServiceMock, EmptyConfigServiceMock } from '../../services/config/config.service.mock';
import type { PlatformService } from '../../services/platform/platform.service';
import { ColorSchemeComponent } from './color-scheme.component';

const document = {
  createElement: jest.fn(() => { return { innerHTML: '' }; }), head: { appendChild: jest.fn() }
};
const meta = {
  addTag: jest.fn()
};
describe('ColorSchemeComponent', () => {
  let component: ColorSchemeComponent;
  let fixture: ComponentFixture<ColorSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ColorSchemeComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ColorSchemeComponent);
    component = fixture.componentInstance;
    component['document'] = document as unknown as Document;
    component['meta'] = meta as unknown as Meta;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('On the Server', () => {
    beforeEach(() => {
      component['platformService'] = { isServer: true, isBrowser: false, isDev: false, isBot: false } as PlatformService;
    });

    describe('With a Config (v1.0.0)', () => {
      beforeEach(() => {
        component['config'] = ConfigServiceMock;
        fixture.detectChanges();

      });
      it('should add a style tag', () => {
        expect(document.createElement).toHaveBeenCalled();
        expect(document.createElement).toHaveBeenCalledWith('style');
        expect(document.head.appendChild).toHaveBeenCalled();
        expect(document.head.appendChild).toHaveBeenCalledWith({ innerHTML: ':root {--background-image: url("./backgrounds/wood.png");--main-color: TEST_MAIN;--secondary-color: TEST_SECONDARY;--tertiary-color: TEST_TERTIARY;--quaternary-color: TEST_QUATERNARY;--main-light-color: TEST_MAIN_LIGHT;--secondary-light-color: TEST_SECONDARY_LIGHT;--tertiary-light-color: TEST_TERTIARY_LIGHT;--quaternary-light-color: TEST_QUATERNARY_LIGHT;}' });
      });
      it('should add a theme-color meta tag', () => {
        expect(meta.addTag).toHaveBeenCalledWith({ content: 'TEST_SECONDARY', media: '(prefers-color-scheme: dark)', name: 'theme-color' });
        expect(meta.addTag).toHaveBeenCalledWith({ content: 'TEST_SECONDARY_LIGHT', media: '(prefers-color-scheme: light)', name: 'theme-color' });
      });
    });
    describe('With an invalid background', () => {
      let consoleSpy: jest.SpyInstance;
      beforeEach(() => {
        component['config'] = { colors: { background: 'invalid' } } as unknown as ConfigService;
        consoleSpy = jest.spyOn(console, 'warn');
        fixture.detectChanges();
      });
      it('should warn about the background', () => {
        expect(consoleSpy).toHaveBeenCalled();
        expect(consoleSpy).toHaveBeenCalledWith('Unknown background image:', 'invalid');
        expect(document.createElement).toHaveBeenCalled();
        expect(document.createElement).toHaveBeenCalledWith('style');
        expect(document.head.appendChild).toHaveBeenCalled();
        expect(document.head.appendChild).toHaveBeenCalledWith({ innerHTML: ':root {}' });
      });
    });
    describe('Without a Config', () => {
      beforeEach(() => {
        component['config'] = EmptyConfigServiceMock;
        fixture.detectChanges();
      });
      it('should add a style tag', () => {
        expect(document.createElement).toHaveBeenCalled();
        expect(document.createElement).toHaveBeenCalledWith('style');
        expect(document.head.appendChild).toHaveBeenCalled();
        expect(document.head.appendChild).toHaveBeenCalledWith({ innerHTML: ':root {}' });
      });
      it('should add a theme-color meta tag', () => {
        expect(meta.addTag).toHaveBeenCalledWith({ content: 'hsl(230, 100%, 15%)', media: '(prefers-color-scheme: dark)', name: 'theme-color' });
        expect(meta.addTag).toHaveBeenCalledWith({ content: 'hsl(230, 100%, 75%)', media: '(prefers-color-scheme: light)', name: 'theme-color' });
      });
    });
  });
  describe('On the Browser', () => {
    beforeEach(() => {
      component['platformService'] = { isServer: false, isBrowser: true, isDev: false, isBot: false } as PlatformService;
      fixture.detectChanges();
    });
    it('should not add a style tag', () => {
      expect(document.createElement).toHaveBeenCalledTimes(0);
      expect(document.head.appendChild).toHaveBeenCalledTimes(0);
    });
  });
});
