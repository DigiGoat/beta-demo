import chalk from 'chalk';
import { execSync } from 'child_process';
import { copyFileSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Goat } from '../src/app/services/goat/goat.service';

const ci = !!process.env['CI'];
const log = {
  debug: (...message: unknown[]): void => console.debug(chalk.dim('>', ...message)),
  info: (...message: unknown[]): void => console.log(...message),
  warn: (...message: unknown[]): void => console.warn(`${ci ? '::warning::' : ''}${chalk.yellowBright(...message)}`),
  error: (...message: unknown[]): void => console.error(`${ci ? '::error::' : ''}${chalk.redBright(...message)}`),
  success: (...message: unknown[]): void => console.log(chalk.greenBright(...message))
};

const config: Record<string, string | Record<string, string | Record<string, string>>> = JSON.parse(readFileSync(join(__dirname, '../src/assets/resources/config.json'), 'utf-8'));
if (process.argv[2]) {
  if (URL.canParse(process.argv[2])) {
    log.debug(`Adding '${process.argv[2]}' to the Config`);
    config['link'] = new URL(process.argv[2]).toString();
    writeFileSync(join(__dirname, '../src/assets/resources/config.json'), JSON.stringify(config, null, 2));
  } else {
    log.error('ARGUMENT PROVIDED IS NOT A VALID URL');
    log.warn('↳ Using URL From Config');

  }
}
const url = config['link'] ? new URL(config['link'] as string) : undefined;
function route() {
  const routes: string[] = ['/404'];
  log.debug('Identifying Doe Routes');
  const does: Goat[] = JSON.parse(readFileSync(join(__dirname, '../src/assets/resources/does.json'), 'utf-8'));
  does.forEach(doe => {
    if (doe.nickname || doe.name || doe.normalizeId) {
      const route = `/does/${doe.nickname || doe.name || doe.normalizeId}`;
      log.debug(`Adding Doe Route '${route}'`);
      routes.push(route);
    }
  });
  log.debug('Identifying Buck Routes');
  const bucks: Goat[] = JSON.parse(readFileSync(join(__dirname, '../src/assets/resources/bucks.json'), 'utf-8'));
  bucks.forEach(buck => {
    if (buck.nickname || buck.name || buck.normalizeId) {
      const route = `/bucks/${buck.nickname || buck.name || buck.normalizeId}`;
      log.debug(`Adding Buck Route '${route}'`);
      routes.push(route);
    }
  });
  log.debug('Writing Routes');
  writeFileSync(join(__dirname, '../routes.txt'), routes.join('\n'));
}
function build() {
  log.debug('Compiling Project');
  const base = url?.pathname;
  execSync(`yarn build ${base ? `--base-href ${base}${base.endsWith('/') ? '' : '/'}` : ''}`);
}
function cleanup() {
  log.debug('Deleting Routes.txt');
  rmSync(join(__dirname, '../routes.txt'));
}
function format404() {
  log.debug('Moving 404 Page From 404 Dir To Base Dir');
  copyFileSync(join(__dirname, '../dist/web-ui/browser/404/index.html'), join(__dirname, '../dist/web-ui/browser/404.html'));
  log.debug('Removing 404 Dir');
  rmSync(join(__dirname, '../dist/web-ui/browser/404/'), { recursive: true });
}
function sitemap(link: string) {
  const sitemap: string[] = [];
  const rootDir = join(__dirname, '../dist/web-ui/browser');

  function scanDirectory(directory: string) {
    const items = readdirSync(directory);
    items.forEach(item => {
      const fullPath = join(directory, item);
      if (lstatSync(fullPath).isDirectory()) {
        scanDirectory(fullPath);
      } else if (item === 'index.html') {
        const sitemapEntry = fullPath.replace(rootDir, '').replace('index.html', '');
        log.debug(`Adding Page '${sitemapEntry}'`);
        sitemap.push(sitemapEntry);
      }
    });
  }

  scanDirectory(rootDir);
  log.debug('Writing Sitemap');
  writeFileSync(join(__dirname, '../dist/web-ui/browser/sitemap.txt'), sitemap.map(entry => `${link.endsWith('/') ? link.slice(0, -1) : link}${entry}`).join('\n'));
}

function robots(link?: string) {
  log.debug('Writing robots.txt');
  writeFileSync(join(__dirname, '../dist/web-ui/browser/robots.txt'),
    `# Allow all URLs (see https://www.robotstxt.org/robotstxt.html)
User-agent: *
Disallow:${link ? `
Sitemap: ${link.endsWith('/') ? link.slice(0, -1) : link}/sitemap.txt` : ''}`);
}
function manifest() {
  let icons = true;
  if (!existsSync(join(__dirname, '../dist/web-ui/browser/assets/icons/'))) {
    log.error('ICONS DIRECTORY NOT FOUND');
    log.warn('↳ Excluding Icons From Manifest');
    icons = false;
    mkdirSync(join(__dirname, '../dist/web-ui/browser/assets/icons/'), { recursive: true });
  }
  log.debug('Writing Manifest');
  writeFileSync(join(__dirname, '../dist/web-ui/browser/assets/icons/site.webmanifest'), JSON.stringify({
    background_color: typeof config['colors'] == 'object' ? config['colors']['main'] : undefined,
    description: config['homeDescription'],
    display: 'standalone',
    icons: icons ? [
      {
        src: './assets/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: './assets/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ].map(icon => url ? url.pathname + (url.pathname.endsWith('/') ? '' : '/') + icon.src.slice(2) : icon.src) : [],
    name: config['homeTitle'],
    scope: url?.toString().endsWith('/') ? url?.toString() : url?.toString() + '/',
    short_name: config['tabTitle'],
    shortcuts: [
      {
        name: 'Does',
        url: './does/',
      },
      {
        name: 'Bucks',
        url: './bucks/',
      }
    ].map(shortcut => url ? url.pathname + (url.pathname.endsWith('/') ? '' : '/') + shortcut.url.slice(2) : shortcut.url),
    start_url: url?.pathname.endsWith('/') ? url?.pathname : url?.pathname + '/',
    theme_color: typeof config['colors'] == 'object' ? config['colors']['secondary'] : undefined
  }, null, 2));
}
function browserConfig() {
  if (!existsSync(join(__dirname, '../dist/web-ui/browser/assets/icons/browserconfig.xml'))) {
    log.error('BROWSER CONFIG NOT FOUND');
    log.warn('↳ Skipping Browser Config Generation');
    return;
  }
  log.debug('Writing Browser Config');
  writeFileSync(join(__dirname, '../dist/web-ui/browser/assets/icons/browserconfig.xml'), readFileSync(join(__dirname, '../dist/web-ui/browser/assets/icons/browserconfig.xml'), 'utf-8').replace('/mstile-150x150.png', url?.pathname ? (url.pathname.endsWith('/') ? url.pathname : url.pathname + '/') + 'assets/icons/mstile-150x150.png' : './assets/icons/mstile-150x150.png'));
}

log.info('Routing...');
route();
log.info('Building...');
build();
log.info('Cleaning Up...');
cleanup();
log.info('Formatting 404...');
format404();
log.info('Generating Sitemap...');
if (url) {
  sitemap(url.toString());
} else {
  log.error('NO URL FOUND IN CONFIG!');
  log.warn('↳ Skipping Sitemap Generation');
}
log.info('Generating Robots.txt...');
if (url) {
  if (url.pathname === '/') {
    robots(url.toString());
  } else {
    log.error('URL IN CONFIG IS NOT AT THE BASE OF THE DOMAIN');
    log.warn('↳ Skipping robots.txt Generation');
  }
} else {
  log.error('NO URL FOUND IN CONFIG!');
  log.warn('↳ Omitting Sitemap From robots.txt');
  robots();
}
log.info('Generating Manifest...');
manifest();
log.info('Generating Browser Config...');
browserConfig();
log.success('Done.');
