import { Component, ElementRef, type OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ConfigService } from '../../services/config/config.service';
import { PlatformService } from '../../services/platform/platform.service';

@Component({
  selector: 'color-scheme',
  templateUrl: './color-scheme.component.html',
  styleUrl: './color-scheme.component.scss'
})
export class ColorSchemeComponent implements OnInit {
  constructor(private config: ConfigService, private platformService: PlatformService, private el: ElementRef<HTMLElement>, private meta: Meta) { }
  private document = this.el.nativeElement.ownerDocument;
  ngOnInit() {
    if (this.platformService.isServer) {
      const style = this.document.createElement('style');
      style.innerHTML = ':root {';

      if (this.config.colors.background) {
        switch (this.config.colors.background) {
          case 'wood':
            style.innerHTML += '--background-image: url("./backgrounds/wood.png");';
            break;
          default:
            console.warn('Unknown background image:', this.config.colors.background);
        }
      }

      if (this.config.colors.main) {
        style.innerHTML += `--main-color: ${this.config.colors.main};`;
      }
      if (this.config.colors.secondary) {
        style.innerHTML += `--secondary-color: ${this.config.colors.secondary};`;
        this.meta.addTag({ name: 'theme-color', content: this.config.colors.secondary, media: '(prefers-color-scheme: dark)' });
      } else {
        this.meta.addTag({ name: 'theme-color', content: 'hsl(230, 100%, 15%)', media: '(prefers-color-scheme: dark)' });
      }
      if (this.config.colors.tertiary) {
        style.innerHTML += `--tertiary-color: ${this.config.colors.tertiary};`;
      }
      if (this.config.colors.quaternary) {
        style.innerHTML += `--quaternary-color: ${this.config.colors.quaternary};`;
      }
      if (this.config.colors.light?.main) {
        style.innerHTML += `--main-light-color: ${this.config.colors.light.main};`;
      }
      if (this.config.colors.light?.secondary) {
        style.innerHTML += `--secondary-light-color: ${this.config.colors.light.secondary};`;
        this.meta.addTag({ name: 'theme-color', content: this.config.colors.light.secondary, media: '(prefers-color-scheme: light)' });
      } else {
        this.meta.addTag({ name: 'theme-color', content: 'hsl(230, 100%, 75%)', media: '(prefers-color-scheme: light)' });
      }
      if (this.config.colors.light?.tertiary) {
        style.innerHTML += `--tertiary-light-color: ${this.config.colors.light.tertiary};`;
      }
      if (this.config.colors.light?.quaternary) {
        style.innerHTML += `--quaternary-light-color: ${this.config.colors.light.quaternary};`;
      }

      style.innerHTML += '}';
      this.document.head.appendChild(style);
    }
  }
}
