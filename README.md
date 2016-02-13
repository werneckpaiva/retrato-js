[![Build Status](https://travis-ci.org/werneckpaiva/retrato-js.svg?branch=master)](https://travis-ci.org/werneckpaiva/retrato-js)

Retrato-JS
==========

Perfect balanced Photo Album javascript plugin.

## About

This project aims to create a javascript plugin that render a photo album using an algorithm that balances the picture sizes according with the window width and height.

You can use standalone or with [retrato](https://github.com/werneckpaiva/retrato/) project.

Installation:
-------------

Installing via Bower

```
bower install retrato-js
```

Or you can download it directly at https://github.com/werneckpaiva/retrato-js/releases

### Dependency:
All the dependencies are downloaded when you use Bower
- jquery
- mustache.js
- watch

## Loading required files:
```html
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/mustache.js.js"></script>
<script type="text/javascript" src="js/watch.js"></script>
<script type="text/javascript" src="js/retrato-js.js"></script>

<link rel="stylesheet" href="css/retrato.css" />
```

## HTML content

Provide the images width and height. The data-photo is an attribute used when you click on the picture and the photo is highlighted.

```html
<div id="album">
    <img src="photos/pic_01_thumb.jpg" width="640" height="426" data-photo="photos/pic_01.jpg"/>
    <img src="photos/pic_02_thumb.jpg" width="426" height="640" data-photo="photos/pic_02.jpg"/>
    <img src="photos/pic_03_thumb.jpg" width="640" height="426" data-photo="photos/pic_03.jpg"/>
    <img src="photos/pic_04_thumb.jpg" width="426" height="640" data-photo="photos/pic_04.jpg"/>
    <img src="photos/pic_05_thumb.jpg" width="640" height="426" data-photo="photos/pic_05.jpg"/>
    <img src="photos/pic_06_thumb.jpg" width="640" height="426" data-photo="photos/pic_06.jpg"/>
</div>
```

## Javascript

Loading the album based on the img tags. It uses the imgs width and height to calculate the image proportion.

```javascript
$(function(){
    var model = new AlbumModel(new AlbumHtmlDelegate($("#album img")));
    var albumPhotos = new AlbumPhotos(model1, {
        view: $("#album"),
        heightProportion: 0.25,
        margin: 2
    });
    model.loadAlbum('/');
});
```
### Attributes
- view: jquery object that points to the album container (usually where the img tags are placed).
- template: a string that represents the html used when creating the container for each image in the album.
e.g. ```<img src="{{src}}" width="{{width}}" height="{{height}}"/>```
- heightProportion: this represents the height proportion that each image should have.
- margin: margin between pictures.

## Highlight
If you want to have an image highlight that opens when the user clicks on the image, you can instantiate the Highlight plugin.

```html
<section id="highlight" class="retrato-highlight"></section>
```
```javascript
var highlight = new Highlight(model, {
    view: $("#highlight")
})
```

[Try out](http://codepen.io/werneckpaiva/pen/Grpyx/)
