describe("Creates model from images", function() {

    var PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    it("should handle a single picture", function(done) {
        var imgs = $("<img src='" + PIXEL + "' width='640' height='480' data-photo='img1.jpg' />");
        var albumHtmlDelegate = new AlbumHtmlDelegate(imgs);
        albumHtmlDelegate.get('/', function(result){
            expect(result).toBeDefined();

            expect(result.path).toBe('/');
            expect(result.pictures.length).toBe(1);

            var picture = result.pictures[0];
            expect(picture.width).toBe('640');
            expect(picture.height).toBe('480');
            expect(picture.thumb).toBe(PIXEL);
            expect(picture.highlight).toBe('img1.jpg');
            expect(picture.url).toBe('img1.jpg');
            expect(picture.ratio).toBe(1.333);

            done();
        }, 
        function(){ });
    }); 

    it("should handle multiple pictures", function(done) {
        var content = "<img src='" + PIXEL + "' width='640' height='480' data-photo='img1.jpg' />";
        content += "<img src='" + PIXEL + "' width='640' height='480' data-photo='img2.jpg' />";
        content += "<img src='" + PIXEL + "' width='640' height='480' data-photo='img3.jpg' />";

        var imgs = $(content);
        var albumHtmlDelegate = new AlbumHtmlDelegate(imgs);
        albumHtmlDelegate.get('/', function(result){
            expect(result).toBeDefined();

            expect(result.path).toBe('/');
            expect(result.pictures.length).toBe(3);

            done();
        }, function(){ });
    }); 

    it("should work without pictures", function(done) {

        var imgs = $("");
        var albumHtmlDelegate = new AlbumHtmlDelegate(imgs);
        albumHtmlDelegate.get('/', 
                function(result){ 
                    expect(result).toBeDefined();
                    expect(result.path).toBe('/');
                    expect(result.pictures.length).toBe(0);
                    done();
                },
                function(){ });
    }); 

});


describe("Updates data model from image tags", function() {

    var PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    it("should fire model change with a single image", function(done) {
        var imgs = $("<img src='" + PIXEL + "' width='640' height='426' data-photo='img1.jpg' />");
        var delegate = new AlbumHtmlDelegate(imgs);
        var model = new AlbumModel(delegate);

        function expectModelChanges(){
            expect(model.pictures.length).toBe(1);

            var picture = model.pictures[0];
            expect(picture.width).toBe('640');
            expect(picture.height).toBe('426');
            expect(picture.thumb).toBe(PIXEL);
            expect(picture.highlight).toBe('img1.jpg');
            expect(picture.url).toBe('img1.jpg');
            expect(picture.ratio).toBe(1.502);

            unwatch(model, "pictures", expectModelChanges);
            done();
        }

        watch(model, "pictures", expectModelChanges);
        model.loadAlbum('/');
    });

});