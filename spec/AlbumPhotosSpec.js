describe("Render pictures from images", function() {

    var PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    it("should display one picture", function() {
        $container = $('<div style="width: 300px"></div>');
        var model = new AlbumModel(null);
        var albumPhotos = new AlbumPhotos(model, {
            view: $container, 
            template: '<img src="{{src}}" width="{{width}}" height="{{height}}"/>',
            lazyLoad: false
        });
        
        model.pictures = [
            {width: 640, height: 426, thumb: PIXEL, highlight: 'img1.jpg', ratio: 1.502}
        ];

        $imgs = $container.find("img");
        expect($imgs.length).toBe(1);
        var $el = $($imgs.get(0));
        expect($el.attr("src")).toBe(PIXEL);
        expect($el.attr("width")).toBeDefined();
        expect($el.attr("height")).toBeDefined();
    }); 

    it("should display multiple pictures", function() {
        $container = $('<div style="width: 400px"></div>');
        var model = new AlbumModel(null);
        var albumPhotos = new AlbumPhotos(model, {
            view: $container, 
            template: '<img src="{{src}}" width="{{width}}" height="{{height}}"/>',
            lazyLoad: false
        });
        
        model.pictures = [
            {width: 640, height: 426, thumb: PIXEL, highlight: 'img1.jpg', ratio: 1.502},
            {width: 426, height: 640, thumb: PIXEL, highlight: 'img2.jpg', ratio: 0.665},
            {width: 640, height: 426, thumb: PIXEL, highlight: 'img3.jpg', ratio: 1.502},
            {width: 640, height: 426, thumb: PIXEL, highlight: 'img4.jpg', ratio: 1.502}
        ];

        $imgs = $container.find("img");
        expect($imgs.length).toBe(4);
    }); 

});