import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TitleStrategy as NgTitleStrategy, type RouterStateSnapshot } from '@angular/router';
import { ConfigService } from '../services/config/config.service';
import { PlatformService } from '../services/platform/platform.service';

@Injectable({ providedIn: 'root' })
export class TitleStrategy extends NgTitleStrategy {
  constructor(private readonly title: Title, private configService: ConfigService, private meta: Meta, private platform: PlatformService) {
    super();
  }
  private readonly tags = ['og:title', 'og:url', 'og:site_name', 'og:type', 'og:description', 'og:image', 'og:image:alt', 'description'];
  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    this.tags.forEach(tag => this.meta.getTags(`name="${tag}"`).forEach(_tag => this.meta.removeTagElement(_tag)));
    if (title !== undefined) {
      const titlePrefix = this.formatTitle(title, routerState);
      this.title.setTitle(`${titlePrefix}${this.configService.tabTitle ? ` · ${this.configService.tabTitle}` : ''}`);
      this.meta.addTags([
        { name: 'og:title', content: titlePrefix.split(' · ').shift()! },
        { name: 'og:url', content: this.configService.link ? (new URL(routerState.url, this.configService.link)).toString() : routerState.url },
        { name: 'og:site_name', content: this.configService.homeTitle },
        { name: 'og:type', content: 'website' },
      ]);
    } else {
      this.title.setTitle(this.configService.tabTitle);
    }
    if (this.platform.isBrowser && !this.platform.isDev && 'gtag' in window) {
      window.gtag('event', 'page_view', {
        page_path: routerState.url
      });
    }
  }
  formatTitle(title: string, routerState: RouterStateSnapshot): string {
    return title.replace(/(^|\s):(\w+)(\s|$)/g, (_match, prefix, id, suffix) => {
      return `${prefix}${this.getParam(id, routerState)}${suffix}`;
    }).replaceAll('-', '·');
  }
  getParam(param: string, routerState: RouterStateSnapshot) {
    function findParams(children: RouterStateSnapshot['root']['children']): Record<string, string> {
      const paramObj = {};
      if (children[0]?.children.length) {
        Object.assign(paramObj, findParams(children[0].children));
      }
      return Object.assign(paramObj, children[0]?.params);
    }
    const paramMap = findParams(routerState.root.children);
    return paramMap[param] ?? `:${param}`;
  }
}
