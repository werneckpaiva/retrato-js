describe("Render pictures from images", function() {

    it("should display one picture", function(done) {
        $container = $('<div style="width: 300px"></div>');
        var model = new AlbumModel(null);
        var albumPhotos = new AlbumPhotos(model, {
            view: $container, 
            template: '<img src="{{src}}" width="{{width}}" height="{{height}}"/>',
            lazyLoad: false
        });
        var domSubtreeModifiedHandler = function() {
            $imgs = $container.find("img");
            expect($imgs.length).toBe(1);
            var $el = $($imgs.get(0));
            expect($el.attr("src")).toBe('img1_thumb.jpg');
            expect($el.attr("width")).toBeDefined();
            expect($el.attr("height")).toBeDefined();
            $container.off("DOMSubtreeModified", domSubtreeModifiedHandler);
            done();
        };
        $container.on("DOMSubtreeModified", domSubtreeModifiedHandler);
        model.pictures = [
            {width: 640, height: 426, thumb: 'img1_thumb.jpg', highlight: 'img1.jpg', ratio: 1.502}
        ];
    }); 

    it("should display multiple pictures", function(done) {
        $container = $('<div style="width: 400px"></div>');
        var model = new AlbumModel(null);
        var albumPhotos = new AlbumPhotos(model, {
            view: $container, 
            template: '<img src="{{src}}" width="{{width}}" height="{{height}}"/>',
            lazyLoad: false
        });
        var domSubtreeModifiedHandler = function() {
            $imgs = $container.find("img");
            expect($imgs.length).toBe(4);
            $container.off("DOMSubtreeModified", domSubtreeModifiedHandler);
            done();
        };
        $container.on("DOMSubtreeModified", domSubtreeModifiedHandler);
        model.pictures = [
            {width: 640, height: 426, thumb: 'img1_thumb.jpg', highlight: 'img1.jpg', ratio: 1.502},
            {width: 426, height: 640, thumb: 'img2_thumb.jpg', highlight: 'img2.jpg', ratio: 0.665},
            {width: 640, height: 426, thumb: 'img3_thumb.jpg', highlight: 'img3.jpg', ratio: 1.502},
            {width: 640, height: 426, thumb: 'img4_thumb.jpg', highlight: 'img4.jpg', ratio: 1.502}
        ];
    }); 

});