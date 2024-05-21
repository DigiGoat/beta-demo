import { Component, Input, ViewChild, ViewEncapsulation, type AfterViewInit, type ElementRef, type OnDestroy, type OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { ConfigService } from '../../services/config/config.service';
import type { ImageEntry } from '../../services/image/image.service';
import { PlatformService } from '../../services/platform/platform.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class CarouselComponent implements AfterViewInit, OnDestroy, OnInit {
  constructor(private platformService: PlatformService, private meta: Meta, private configService: ConfigService) { }
  ngOnInit() {
    for (const image of this.images) {
      this.meta.addTag({ property: 'og:image', content: this.configService.link ? new URL(image.file, this.configService.link).toString() : image.file });
      //this.meta.addTags([{ name: 'og:image:width', content: '400' }, { name: 'og:image:height', content: '200' }], true);
      if (image.alt) {
        this.meta.addTag({ property: 'og:image:alt', content: image.alt });
      }
    }
  }
  @Input() images: ImageEntry[] = [];

  ngOnDestroy() {
    this.carousel?.dispose();
  }

  @ViewChild('carousel') carouselElement!: ElementRef<HTMLDivElement>;
  private carousel?: bootstrap.Carousel;
  ngAfterViewInit() {
    if (this.platformService.isBrowser) {
      this.carousel = bootstrap.Carousel.getOrCreateInstance(this.carouselElement.nativeElement);
    }
  }
}
