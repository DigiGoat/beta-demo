import { Directive, ElementRef, OnInit } from '@angular/core';
import { ImageService } from '../../services/image/image.service';

@Directive({
  selector: 'img'
})
export class ImgDirective implements OnInit {
  constructor(private el: ElementRef<HTMLImageElement>, private imageService: ImageService) { }

  ngOnInit() {
    setTimeout(() => {
      if (!this.el.nativeElement.complete) {
        this.placeholder(true);
      }
    }, 500);
    this.el.nativeElement.addEventListener('load', () => {
      this.placeholder(false);
    });
    this.el.nativeElement.addEventListener('error', () => {
      console.warn('Failed to load image from', this.el.nativeElement.src, 'with alt', this.el.nativeElement.alt);
      this.notFound();
      this.placeholder(false);
    }, { once: true });
  }

  placeholder(placeholder: boolean) {
    if (placeholder) {
      this.el.nativeElement.classList.add('placeholder', 'border');
      if (!this.el.nativeElement.parentElement!.classList.contains('placeholder-glow')) {
        this.el.nativeElement.parentElement!.classList.add('placeholder-wave');
      }
    } else {
      this.el.nativeElement.classList.remove('placeholder', 'border');
      this.el.nativeElement.parentElement!.classList.remove('placeholder-wave', 'placeholder-glow');
    }
  }
  notFound() {
    this.el.nativeElement.style.backgroundImage = `url('${this.imageService.NotFound.file}')`;
    this.el.nativeElement.classList.add('not-found');
  }
}
