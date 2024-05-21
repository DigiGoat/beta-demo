import { Component, ElementRef, type OnInit } from '@angular/core';
import { ConfigService } from '../../services/config/config.service';
import { PlatformService } from '../../services/platform/platform.service';

@Component({
  selector: 'analytics',
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent implements OnInit {
  constructor(private config: ConfigService, private platformService: PlatformService, private el: ElementRef<HTMLElement>) { }
  private document = this.el.nativeElement.ownerDocument;
  ngOnInit() {
    if (this.platformService.isServer) {
      if (this.platformService.isDev) {
        const script = this.document.createComment('Analytics disabled in development mode');
        this.document.head.appendChild(script);
      } else {
        if (this.config.analytics.clarity) {
          const script = this.document.createElement('script');
          script.innerHTML = `(function (c, l, a, r, i, t, y) { c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); }; t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i; y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y); })(window, document, "clarity", "script", "${this.config.analytics.clarity}");`;
          this.document.head.appendChild(script);
        }
        if (this.config.analytics.gtag) {
          const script = this.document.createElement('script');
          script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.analytics.gtag}`;
          script.async = true;
          this.document.head.appendChild(script);
          const script2 = this.document.createElement('script');
          script2.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } gtag('js', new Date()); gtag('config', '${this.config.analytics.gtag}', { send_page_view: false });`;
          this.document.head.appendChild(script2);
        }
      }
    } else if (this.platformService.isBrowser) {
      const color = this.document.documentElement.getAttribute('data-bs-theme') == 'light' ? 'Light' : 'Dark';
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
