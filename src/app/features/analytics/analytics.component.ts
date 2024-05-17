import { Component, ElementRef, type OnInit } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';
import { PlatformService } from '../../services/platform/platform.service';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit {
  constructor(private config: ConfigService, private platformService: PlatformService, private el: ElementRef<HTMLElement>) { }
  ngOnInit() {
    if (this.platformService.isDev) {
      this.el.nativeElement.innerHTML = '<!-- Analytics disabled in development mode -->';
    } else if (this.platformService.isServer) {
      if (this.config.analytics.clarity) {
        this.el.nativeElement.innerHTML += `<script>(function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); }; t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, "clarity", "script", "${this.config.analytics.clarity}");</script>`;
      }
      if (this.config.analytics.gtag) {
        this.el.nativeElement.innerHTML += `<script src="https://www.googletagmanager.com/gtag/js?id=${this.config.analytics.gtag}" async></script>`;
        this.el.nativeElement.innerHTML += '<script>window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); }</script>';
      }
    } else if (this.platformService.isBrowser) {
      const color = window.matchMedia('(prefers-color-scheme: dark)') ? 'Dark' : 'Light';
      if ('clarity' in window) {
        window.clarity('set', 'Color Scheme', color);
      }
      if ('gtag' in window) {
        window.gtag('set', 'Color Scheme', color);
        window.gtag('js', new Date());
        window.gtag('config', this.config.analytics.gtag!, { send_page_view: false });
      }
    }
  }
}
