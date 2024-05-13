import type { ElementRef } from '@angular/core';
import type { ImageService } from '../../services/image/image.service';
import { ImgDirective } from './img.directive';

const body = document.createElement('body');
body.innerHTML = `
  <div>
    <img>
  </div>
  <div class="placeholder-glow">
    <img>
  </div>
  <div class="placeholder-wave">
    <img>
  </div>
  <div>
    <img class="placeholder">
  </div>
  <div class="placeholder-glow">
    <img class="placeholder">
  </div>
  <div class="placeholder-wave">
    <img class="placeholder">
  </div>
`;

describe('ImgDirective', () => {
  let directive: ImgDirective;
  let el: ElementRef<HTMLImageElement>;
  let html: HTMLImageElement;
  let placeholderSpy: jest.SpyInstance;
  let notFoundSpy: jest.SpyInstance;
  let consoleSpy: jest.SpyInstance;
  const imageService = {
    NotFound: {
      file: 'TEST_FILE',
      alt: 'TEST_ALT',
    }
  } as ImageService;

  describe.each(Array.from(body.querySelectorAll('img')))('Image %#', (image) => {
    beforeEach(() => {
      el = {
        nativeElement: image
      } as ElementRef<HTMLImageElement>;

      directive = new ImgDirective(el, imageService);
      placeholderSpy = jest.spyOn(directive, 'placeholder');
      notFoundSpy = jest.spyOn(directive, 'notFound');
      consoleSpy = jest.spyOn(console, 'warn');
      html = el.nativeElement;
      jest.useFakeTimers();
    });

    it('should create an instance', () => {
      directive.ngOnInit();
      expect(directive).toBeTruthy();
    });

    it('should add placeholder class to image and parent class if the image is loading', () => {
      const imgSpy = jest.spyOn(html, 'complete', 'get').mockReturnValue(false);
      directive.ngOnInit();
      jest.runAllTimers();
      expect(imgSpy).toHaveBeenCalledTimes(1);

      expect(placeholderSpy).toHaveBeenCalledTimes(1);
      expect(placeholderSpy).toHaveBeenCalledWith(true);

      const classList = html.classList;
      const parentClassList = html.parentElement!.classList;

      expect(classList).toContain('placeholder');
      expect(classList).toContain('border');
      if (parentClassList.contains('placeholder-glow')) {
        expect(parentClassList).not.toContain('placeholder-wave');
      } else {
        expect(parentClassList).toContain('placeholder-wave');
      }
    });

    it('should not add placeholder class if the image is loaded', () => {
      const imgSpy = jest.spyOn(html, 'complete', 'get').mockReturnValue(true);
      directive.ngOnInit();
      expect(imgSpy).not.toHaveBeenCalled();
      jest.runAllTimers();
      expect(imgSpy).toHaveBeenCalledTimes(1);

      expect(placeholderSpy).not.toHaveBeenCalled();
    });

    it('should remove placeholder class and parent class on load event', () => {
      directive.ngOnInit();
      placeholderSpy.mockClear();
      html.dispatchEvent(new Event('load'));

      expect(placeholderSpy).toHaveBeenCalledTimes(1);
      expect(placeholderSpy).toHaveBeenCalledWith(false);


      const classList = html.classList;
      const parentClassList = html.parentElement!.classList;

      expect(classList).not.toContain('placeholder');
      expect(classList).not.toContain('border');
      expect(parentClassList).not.toContain('placeholder-wave');
      expect(parentClassList).not.toContain('placeholder-glow');
    });

    it('should log warning and call notFound method on error event', () => {
      directive.ngOnInit();
      placeholderSpy.mockClear();
      html.dispatchEvent(new Event('error'));

      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to load image from',
        html.src,
        'with alt',
        html.alt
      );
      expect(placeholderSpy).toHaveBeenCalledTimes(1);
      expect(placeholderSpy).toHaveBeenCalledWith(false);

      expect(notFoundSpy).toHaveBeenCalledTimes(1);
      expect(html.style.backgroundImage).toBe(`url(${imageService.NotFound.file})`);
      expect(html.classList).toContain('not-found');
    });
  });
});
