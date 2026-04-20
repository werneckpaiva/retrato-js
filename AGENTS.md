# Agent Instructions for Retrato-JS

This file provides instructions for AI agents working on this project.

## Project Overview
Retrato-JS is a frontend JavaScript library for creating balanced photo albums. It is built as a traditional jQuery plugin and uses global variables (not ES6 modules).

## Build and Package
The project uses standard NPM scripts for all development tasks. Do NOT use Grunt or Bower.

- **Build**: `npm run build`
  - Concatenates files from `src/` into `dist/retrato-js.js`.
  - Minifies the result into `dist/retrato-js.min.js` using Terser.
  - Copies CSS files to `dist/`.
- **Clean**: `npm run clean`
  - Removes the `dist/` and `spec/vendor/` directories.

## Testing
Tests are written with Jasmine and run in a headless browser using `jasmine-browser-runner` and Puppeteer.

- **Run Tests**: `npm test`
  - This first runs `npm run pretest` which copies dependencies from `node_modules` into `src/vendor/` so they can be served by the test runner.
- **Test Configuration**: `spec/support/jasmine-browser.json`
  - Controls which files are served and the load order.
  - Vendor files MUST be listed in `srcFiles` if they are needed by the library during initialization (e.g., jQuery).

## Troubleshooting Tests
- **"ReferenceError: $ is not defined"**: Ensure `src/vendor/jquery.js` exists and is listed at the top of `srcFiles` in `jasmine-browser.json`.
- **Headless Browser Errors**: Some browser APIs (like Fullscreen) or dialogs (like alert) may fail or block in headless mode. Use `spec/helpers/test-helper.js` to mock these.
- **Resource Loading**: Use Data URIs in specs to avoid `net::ERR_FILE_NOT_FOUND` errors when the browser tries to load non-existent image paths.

## Code Style
- Use **ESLint** for linting: `npm run lint`.
- The code uses older JavaScript patterns (Var, Globals). Transitioning to ES6 modules would be a major breaking change and should be discussed with the user.
