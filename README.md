# Retrato-JS

[![CI](https://github.com/werneckpaiva/retrato-js/actions/workflows/ci.yml/badge.svg)](https://github.com/werneckpaiva/retrato-js/actions/workflows/ci.yml)

A perfectly balanced Photo Album JavaScript plugin.

Retrato-JS uses a smart algorithm to render photo albums where picture sizes are balanced according to the window width and height, creating a seamless and beautiful gallery layout.

## Features

- **Balanced Layout**: Automatically calculates optimal image sizes to fill the row width.
- **Responsive**: Re-adjusts the layout on window resize.
- **Lazy Loading**: Efficiently loads images only when they are about to become visible.
- **Highlight Mode**: Includes a full-screen image viewer with:
  - Navigation arrows (prev/next).
  - Keyboard support (Arrows and Esc).
  - Low-res to high-res transition for smooth loading.
  - Background blur effect using the current image.
- **Flexible Data Sources**: Load images directly from HTML or via JSON API.

## Installation

### Via NPM
```bash
npm install retrato-js
```

### Manual Download
Download the latest release from the [GitHub Releases](https://github.com/werneckpaiva/retrato-js/releases) page.

## Quick Start

### 1. Load Required Files
Include jQuery, Mustache.js, Watch.js, and Retrato-JS in your HTML (find them in `node_modules` or use a CDN):

```html
<link rel="stylesheet" href="dist/retrato.css" />

<script src="path/to/jquery.js"></script>
<script src="path/to/mustache.js"></script>
<script src="path/to/watch.js"></script>
<script src="dist/retrato-js.min.js"></script>
```

### 2. HTML Structure
Create a container for your album and an optional section for the highlight viewer:

```html
<div id="album">
    <!-- Images will be rendered here -->
</div>

<!-- Optional Highlight Viewer -->
<section id="highlight" class="retrato-highlight"></section>
```

### 3. Initialize
```javascript
$(function() {
    // 1. Initialize the model with a delegate
    var delegate = new AlbumHtmlDelegate($("#album img"));
    var model = new AlbumModel(delegate);

    // 2. Initialize the AlbumPhotos component
    var album = new AlbumPhotos(model, {
        view: $("#album"),
        heightProportion: 0.25,
        margin: 2
    });

    // 3. Optional: Initialize the Highlight component
    var highlight = new Highlight(model, {
        view: $("#highlight")
    });

    // 4. Load the album
    model.loadAlbum('/');
});
```

## Data Sources

### HTML Delegate
Uses existing `<img>` tags to populate the album. Useful for SEO and simple static pages.
```javascript
var delegate = new AlbumHtmlDelegate($("#source-images img"));
```

### Ajax Delegate
Loads album data from a JSON API.
```javascript
var delegate = new AlbumAjaxDelegate();
```
The API should return a JSON object with a `pictures` array:
```json
{
  "path": "/my-album",
  "pictures": [
    {
      "thumb": "path/to/thumb.jpg",
      "highlight": "path/to/large.jpg",
      "width": 640,
      "height": 480
    }
  ]
}
```

## Configuration Options

### AlbumPhotos Options
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `view` | jQuery Object | **Required** | The container where the album will be rendered. |
| `template` | String | See below | HTML template for each image. |
| `heightProportion` | Number | `0.45` | Preferred height of rows (0 to 1). |
| `margin` | Number | `0` | Margin between images in pixels. |
| `lazyLoad` | Boolean | `false` | Enable lazy loading of images. |
| `listClass` | String | `null` | Optional class to find the list container inside `view`. |

**Default Template:**
```html
<img src="{{src}}" width="{{width}}" height="{{height}}"/>
```

### Highlight Options
| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `view` | jQuery Object | **Required** | The container for the highlight viewer. |
| `template` | String | See below | HTML template for the frame. |
| `detailsView`| jQuery Object | `[]` | Container to show image details. |

**Default Template:**
```html
<div class="photo-frame">
    <div class="large-photo">
        <img class="low-res" />
        <img class="high-res"/>
    </div>
</div>
```

## Development

### Installation
```bash
npm install
```

### Build
Generates a bundled and minified version in the `dist` folder.
```bash
npm run build
```

### Testing
Runs the spec suite in a headless browser.
```bash
npm test
```

### Linting
Checks code style with ESLint.
```bash
npm run lint
```

## Demo
[Try it out on CodePen](http://codepen.io/werneckpaiva/pen/Grpyx/)

## License
Apache License 2.0

