describe("AlbumHtmlDelegate", function() {

    it("single picture", function(done) {
        var imgs = $("<img src='img1_thumb.jpg' width='640' height='480' data-photo='img1.jpg' />");
        var albumHtmlDelegate = new AlbumHtmlDelegate(imgs);
        albumHtmlDelegate.get('/', function(result){
            expect(result).toBeDefined();

            expect(result.path).toBe('/');
            expect(result.pictures.length).toBe(1);

            var picture = result.pictures[0];
            expect(picture.width).toBe('640');
            expect(picture.height).toBe('480');
            expect(picture.thumb).toBe('img1_thumb.jpg');
            expect(picture.highlight).toBe('img1.jpg');
            expect(picture.url).toBe('img1.jpg');
            expect(picture.ratio).toBe(1.333);

            done();
        }, 
        function(){ });
    }); 

    it("multiple pictures", function(done) {
        var content = "<img src='img1_thumb.jpg' width='640' height='480' data-photo='img1.jpg' />";
        content += "<img src='img2_thumb.jpg' width='640' height='480' data-photo='img2.jpg' />";
        content += "<img src='img3_thumb.jpg' width='640' height='480' data-photo='img3.jpg' />";

        var imgs = $(content);
        var albumHtmlDelegate = new AlbumHtmlDelegate(imgs);
        albumHtmlDelegate.get('/', function(result){
            expect(result).toBeDefined();

            expect(result.path).toBe('/');
            expect(result.pictures.length).toBe(3);

            done();
        }, function(){ });
    }); 

    it("fails without pictures", function(done) {

        var imgs = $("");
        var albumHtmlDelegate = new AlbumHtmlDelegate(imgs);
        albumHtmlDelegate.get('/', 
                function(result){ },
                function(){ 
                    done();
                });
    }); 

});


describe("AlbumModelWithHtmlDelegate", function() {

    it("single picture", function(done) {
        var imgs = $("<img src='img1_thumb.jpg' width='640' height='426' data-photo='img1.jpg' />");
        var delegate = new AlbumHtmlDelegate(imgs);
        var model = new AlbumModel(delegate);

        function expectModelChanges(){
            expect(model.pictures.length).toBe(1);

            var picture = model.pictures[0];
            expect(picture.width).toBe('640');
            expect(picture.height).toBe('426');
            expect(picture.thumb).toBe('img1_thumb.jpg');
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