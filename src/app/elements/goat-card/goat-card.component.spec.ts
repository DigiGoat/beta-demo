import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgePipe } from '../../pipes/age.pipe';
import { ImageService } from '../../services/image/image.service';
import { GoatCardComponent } from './goat-card.component';


describe('GoatCardComponent', () => {
  let component: GoatCardComponent;
  let fixture: ComponentFixture<GoatCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoatCardComponent, AgePipe],
      providers: [ImageService],
    })
      .compileComponents();
    fixture = TestBed.createComponent(GoatCardComponent);
    component = fixture.componentInstance;
    TestBed.inject(ImageService);
    component['imageService']['imageMap'] = {
      TEST_NICKNAME: [
        { file: 'TEST_IMAGE_FILE', alt: 'TEST_IMAGE_ALT' }
      ]
    };
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  describe('With a Goat (v1.0.0)', () => {
    let html: HTMLElement;
    beforeEach(() => {
      component['goat'] = {
        nickname: 'TEST_NICKNAME',
        name: 'YOUR GOATS ADGA NAME',
        description: 'A quick description about your goat',
        dateOfBirth: new Date(Date.now() - (1000 * 3600 * 24)).toString(),
        normalizeId: 'PD12345',
      };
      fixture.detectChanges();
      html = fixture.nativeElement;
    });
    it('should exist', () => {
      const element = html.querySelector('[test-id="goat"]') as HTMLDivElement;
      expect(element).toBeTruthy();
    });
    it('should NOT display the placeholder div', () => {
      const element = html.querySelector('[test-id="placeholder"]') as HTMLDivElement;
      expect(element).toBeFalsy();
    });
    it('should have an image', () => {
      const element = html.querySelector('[test-id="goat-image"]') as HTMLImageElement & { ngSrc: string; };
      expect(element).toBeTruthy();
      expect(element.ngSrc).toBe('./assets/images/TEST_NICKNAME/TEST_IMAGE_FILE');
      expect(element.width).toBe(400);
      expect(element.height).toBe(250);
    });
    it('should have a link', () => {
      const element = html.querySelector('[test-id="goat-link"]') as HTMLAnchorElement & { routerLink: string; };
      expect(element).toBeTruthy();
      expect(element.routerLink).toBe('TEST_NICKNAME');
    });
    it('should have a name', () => {
      const element = html.querySelector('[test-id="goat-name"]') as HTMLHeadingElement;
      expect(element).toBeTruthy();
      expect(element.innerHTML).toBe('YOUR GOATS ADGA NAME');
    });
    it('should have an age', () => {
      const element = html.querySelector('[test-id="goat-age"]') as HTMLHeadingElement;
      expect(element).toBeTruthy();
      expect(element.innerHTML).toBe('1 day old');
    });
    it('should have a nickname', () => {
      const element = html.querySelector('[test-id="goat-nickname"]') as HTMLHeadingElement;
      expect(element).toBeTruthy();
      expect(element.innerHTML).toBe('"TEST_NICKNAME"');
    });
    it('should have a description', () => {
      const element = html.querySelector('[test-id="goat-description"]') as HTMLDivElement;
      expect(element).toBeTruthy();
      expect(element.innerHTML).toBe('A quick description about your goat');
    });
    it('should match the snapshot', () => {
      expect(fixture).toMatchSnapshot();
    });
  });
  describe('With an empty Goat', () => {
    let html: HTMLElement;
    beforeEach(() => {
      component['goat'] = {};
      fixture.detectChanges();
      html = fixture.nativeElement;
    });
    it('should exist', () => {
      const element = html.querySelector('[test-id="goat"]') as HTMLDivElement;
      expect(element).toBeTruthy();
    });
    it('should NOT display the placeholder div', () => {
      const element = html.querySelector('[test-id="placeholder"]') as HTMLDivElement;
      expect(element).toBeFalsy();
    });
    it('should have an image', () => {
      const element = html.querySelector('[test-id="goat-image"]') as HTMLImageElement & { ngSrc: string; };
      expect(element).toBeTruthy();
      expect(element.ngSrc).toBe('/');
      expect(element.width).toBe(400);
      expect(element.height).toBe(250);
    });
    it('should have a link', () => {
      const element = html.querySelector('[test-id="goat-link"]') as HTMLAnchorElement & { routerLink: string; };
      expect(element).toBeFalsy();
    });
    it('should have a name', () => {
      const element = html.querySelector('[test-id="goat-name"]') as HTMLHeadingElement;
      expect(element).toBeTruthy();
      expect(element.innerHTML).toBe('');
    });
    it('should have an age', () => {
      const element = html.querySelector('[test-id="goat-age"]') as HTMLHeadingElement;
      expect(element).toBeFalsy();
    });
    it('should have a nickname', () => {
      const element = html.querySelector('[test-id="goat-nickname"]') as HTMLHeadingElement;
      expect(element).toBeFalsy();
    });
    it('should have a description', () => {
      const element = html.querySelector('[test-id="goat-description"]') as HTMLDivElement;
      expect(element).toBeFalsy();
    });
    it('should match the snapshot', () => {
      expect(fixture).toMatchSnapshot();
    });
  });
  describe('Without a Goat', () => {
    let html: HTMLElement;
    beforeEach(() => {
      fixture.detectChanges();
      html = fixture.nativeElement;
    });
    it('should exist', () => {
      const element = html.querySelector('[test-id="placeholder"]') as HTMLDivElement;
      expect(element).toBeTruthy();
    });
    it('should NOT display the goat div', () => {
      const element = html.querySelector('[test-id="goat"]') as HTMLDivElement;
      expect(element).toBeFalsy();
    });
    it('should have a placeholder image', () => {
      const element = html.querySelector('[test-id="placeholder-image"]') as HTMLImageElement;
      expect(element).toBeTruthy();
      expect(element.parentElement!.classList).toContain('placeholder-glow');
      expect(element.width).toBe(400);
      expect(element.height).toBe(200);
    });
    it('should have a placeholder name', () => {
      const element = html.querySelector('[test-id="placeholder-name"]') as HTMLHeadingElement;
      expect(element).toBeTruthy();
      expect(element.classList).toContain('placeholder');
      expect(element.parentElement!.classList).toContain('placeholder-wave');
      expect(element.textContent).toBe('SOME ANIMALS NAME');
    });
    it('should have a placeholder nickname', () => {
      const element = html.querySelector('[test-id="placeholder-nickname"]') as HTMLHeadingElement;
      expect(element).toBeTruthy();
      expect(element.classList).toContain('placeholder');
      expect(element.parentElement!.classList).toContain('placeholder-wave');
      expect(element.textContent).toBe('"Nickname"');
    });
    it('should match the snapshot', () => {
      expect(fixture).toMatchSnapshot();
    });
  });
});
