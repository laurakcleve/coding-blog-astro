---
title: 'How to fix: Playwright caching error in Github actions'
date: '2023-01-31'
description: '"Host system is missing dependencies to run browsers"'
---

I ran into this issue while setting up CI for a fresh Next.js site, where I set up Playwright to run in my Github Actions. By default, Playwright downloads all the browsers on every run, and this led to my tests taking around 2 minutes. The <a href="https://playwright.dev/docs/ci#caching-browsers" target="_blank" rel="noopener noreferrer">Playwright docs</a> give these instructions for caching the browsers:

> With the default behavior, Playwright downloads the browser binaries in the following directories:
>
> - `%USERPROFILE%\AppData\Local\ms-playwright` on Windows
> - `~/Library/Caches/ms-playwright` on MacOS
> - `~/.cache/ms-playwright` on Linux
>
> To cache the browser downloads between CI runs, cache this location in your CI configuration, against a hash of the Playwright version.

Here's the implementation in `.github/workflows/playwright.yml`:

```yaml
- name: Get installed Playwright version
  id: playwright-version
  run: echo "PLAYWRIGHT_VERSION=$(node -e "console.log(require('./package-lock.json').dependencies['@playwright/test'].version)")" >> $GITHUB_ENV

- uses: actions/cache@v3
  name: Check for Playwright browsers cache
  id: playwright-cache
  with:
    path: |
      ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ env.PLAYWRIGHT_VERSION }}

- name: Install dependencies
  run: npm ci

- name: Install Playwright Browsers
  run: npx playwright install --with-deps
  if: steps.playwright-cache.outputs.cache-hit != 'true'
```

The problem was, the actions reported the cache being restored successfully, but the tests failed because of this error:

```
❌ 1) [webkit] › homepage.spec.ts:3:5 › has title ==========

browserType.launch:
  ╔══════════════════════════════════════════════════════╗
  ║ Host system is missing dependencies to run browsers. ║
  ║ Please install them with the following command:      ║
  ║                                                      ║
  ║     sudo npx playwright install-deps                 ║
  ║                                                      ║
  ║ Alternatively, use apt:                              ║
  ║     sudo apt-get install libvpx7\                    ║
  ║         libevent-2.1-7\                              ║
  ║         libopus0\
  ║         libwoff1\                                    ║
  ║         libharfbuzz-icu0\                            ║
  ║         libgstreamer-plugins-base1.0-0\              ║
  ║         libgstreamer-gl1.0-0\                        ║
  ║         libhyphen0\                                  ║
  ║         libmanette-0.2-0\                            ║
  ║         libgles2\                                    ║
  ║         gstreamer1.0-libav                           ║
  ║                                                      ║
  ║ <3 Playwright Team                                   ║
  ╚══════════════════════════════════════════════════════╝
```

It seems that the OS dependencies for each of Playwright's default browsers except Webkit are already present in the default installation on the Github runners. Playwright caches the browser binaries, but not their dependencies. So the method above leads to us having to install those extra browser dependencies separately when the cached browsers are restored. You can do that by adding the following to `playwright.yml` just after the `Install Playwright Browsers` action:

```yaml
- run: npx playwright install-deps
  if: steps.playwright-cache.outputs.cache-hit == 'true'
```

This gets everything to run correctly, but the dependency install still adds about 40 seconds to my tests. Ideally I would like to cache the OS dependencies, but as yet haven't figured out how. The alternative method, to minimize your action run time, would be to skip Webkit in your tests by removing the `webkit` project from your Playwright config.

Here's a long running <a href="https://github.com/microsoft/playwright/issues/7249" target="_blank" rel="noopener noreferrer">discussion around the issue on Github</a>.
