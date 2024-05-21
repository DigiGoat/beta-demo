import { ComponentFixture, TestBed } from '@angular/core/testing';

import type { Meta } from '@angular/platform-browser';
import type { ConfigService } from '../../services/config/config.service';
import type { PlatformService } from '../../services/platform/platform.service';
import { CarouselComponent } from './carousel.component';

const bootstrap = { Carousel: { getOrCreateInstance: jest.fn().mockReturnValue({ dispose: jest.fn() }) } };
describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;
  let html: HTMLElement;

  beforeEach(async () => {
    (window as unknown as { bootstrap: object; }).bootstrap = bootstrap;
    await TestBed.configureTestingModule({
      declarations: [CarouselComponent]
    })
      .compileComponents();
    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    html = fixture.nativeElement;
    //component['configService'] = jest.fn().mockReturnValue(ConfigServiceMock) as unknown as ConfigService;
  });
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  describe('On the Server', () => {
    beforeEach(() => {
      component['platformService'] = {
        isServer: true,
        isBrowser: false,
      } as PlatformService;
      fixture.detectChanges();
    });
    it('should not create the carousel', () => {
      expect(bootstrap.Carousel.getOrCreateInstance).not.toHaveBeenCalledTimes(1);
    });
  });
  describe('In a Browser', () => {
    beforeEach(() => {
      component['platformService'] = {
        isServer: false,
        isBrowser: true,
      } as PlatformService;
      fixture.detectChanges();
    });
    it('should create the carousel', () => {
      expect(bootstrap.Carousel.getOrCreateInstance).toHaveBeenCalledTimes(1);
    });
    it('should dispose the carousel when destroyed', () => {
      fixture.destroy();
      expect(component['carousel']!.dispose).toHaveBeenCalledTimes(1);
    });
  });
  describe('With Images', () => {
    const meta = { addTag: jest.fn() };
    beforeEach(() => {
      component['meta'] = meta as unknown as Meta;
      component['images'] = [{ file: 'TEST_IMAGE_1' }, { file: 'TEST_IMAGE_2', alt: 'TEST_ALT_1' }];
    });
    describe('With a configured link', () => {
      beforeEach(() => {
        component['configService'] = { link: 'https://test.link' } as ConfigService;
        fixture.detectChanges();
      });
      it('should add image meta tags', () => {
        expect(component['meta'].addTag).toHaveBeenCalledTimes(3);
        expect(component['meta'].addTag).toHaveBeenNthCalledWith(1, { 'content': 'https://test.link/TEST_IMAGE_1', property: 'og:image' });
        expect(component['meta'].addTag).toHaveBeenNthCalledWith(2, { 'content': 'https://test.link/TEST_IMAGE_2', property: 'og:image' });
        expect(component['meta'].addTag).toHaveBeenNthCalledWith(3, { 'content': 'TEST_ALT_1', property: 'og:image:alt' });
      });
      it('should make the carousel', () => {
        const element = html.querySelectorAll('[test-id=carousel]');
        expect(element).toHaveLength(1);
      });
      it('should have an indicator for each image', () => {
        const element = html.querySelectorAll('[test-id=image-tab]');
        expect(element).toHaveLength(2);
      });
      it('should have images', () => {
        const element = html.querySelectorAll('[test-id=image]');
        expect(element).toHaveLength(2);
      });
      it('should have control icons', () => {
        const element = html.querySelectorAll('[test-id=control-icons]');
        expect(element).toHaveLength(2);
      });
      it('should match the snapshot', () => {
        expect(fixture).toMatchSnapshot();
      });
    });
    describe('Without a configured link', () => {
      beforeEach(() => {
        component['configService'] = {} as ConfigService;
        fixture.detectChanges();
      });
      it('should add image meta tags', () => {
        expect(component['meta'].addTag).toHaveBeenCalledTimes(3);
        expect(component['meta'].addTag).toHaveBeenNthCalledWith(1, { content: 'TEST_IMAGE_1', property: 'og:image' });
        expect(component['meta'].addTag).toHaveBeenNthCalledWith(2, { content: 'TEST_IMAGE_2', property: 'og:image' });
        expect(component['meta'].addTag).toHaveBeenNthCalledWith(3, { content: 'TEST_ALT_1', property: 'og:image:alt' });
      });
      it('should make the carousel', () => {
        const element = html.querySelectorAll('[test-id=carousel]');
        expect(element).toHaveLength(1);
      });
      it('should have an indicator for each image', () => {
        const element = html.querySelectorAll('[test-id=image-tab]');
        expect(element).toHaveLength(2);
      });
      it('should have images', () => {
        const element = html.querySelectorAll('[test-id=image]');
        expect(element).toHaveLength(2);
      });
      it('should have control icons', () => {
        const element = html.querySelectorAll('[test-id=control-icons]');
        expect(element).toHaveLength(2);
      });
      it('should match the snapshot', () => {
        expect(fixture).toMatchSnapshot();
      });
    });
  });
});
