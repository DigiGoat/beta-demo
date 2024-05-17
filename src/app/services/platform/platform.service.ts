import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, isDevMode } from '@angular/core';
import { isbot } from 'isbot';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {

  public isServer = isPlatformServer(this.platformId);
  public isBrowser = isPlatformBrowser(this.platformId);
  public isBot = this.isBrowser && isbot(navigator.userAgent);
  public isDev = isDevMode();

  constructor(@Inject(PLATFORM_ID)
  private platformId: object) { }
}
