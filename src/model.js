function AlbumModel(albumDelegate){

    var delegate = albumDelegate;
    var self = this;

    this.path = null;
    this.albuns = null;
    this.pictures = null;
    this.visibility = null;
    this.token = null;

    this.loading = false;

    this.selectedPictureIndex = null;
    this.highlightOn = false;
    this.detailsOn = false;

    this.loadAlbum = function(albumPath, resultHandler, errorHandler){
        self.loading = true;
        delegate.get(albumPath, 
                function(result){
                    loadAlbumResultHandler(result);
                    if (resultHandler !== undefined) resultHandler(result);
                }, 
                function(error){
                    loadAlbumFailHandler(error);
                    if (errorHandler !== undefined) errorHandler(error);
                });
    };

    function loadAlbumResultHandler(result){
        for (var prop in result){
            if (self.hasOwnProperty(prop)){
                self[prop] = result[prop];
            }
        }
        self.loading = false;
        self.selectedPictureIndex = null;
    }

    function loadAlbumFailHandler(error){
        self.loading = false;
        alert("Album does not exist");
    }

    return this;
}

function AlbumAjaxDelegate(){

    this.get = function(albumPath, resultHandler, failHandler){
        var url = albumPath.replace(Settings.URL_PREFIX, '');
        url = Settings.URL_DATA_PREFIX + url;
        url = StringUtil.sanitizeUrl(url);
        $.get(url, function(result) {
            resultHandler(result);
        }).fail(function(status){
            failHandler(status);
        });
    };
}

function AlbumHtmlDelegate(imgs){
    this.get = function(albumPath, resultHandler, failHandler){
        var result = {
                path: albumPath,
                pictures: []
        };
        imgs.each(function(i, element){
            $el = $(element);
            var ratio = parseFloat($el.attr("width")) / parseFloat($el.attr("height"));
            ratio = Math.round(ratio * 1000) / 1000;
            var picture = {
                    width: $el.attr("width"),
                    height: $el.attr("height"),
                    thumb: $el.attr("src"),
                    url: $el.data("photo"),
                    highlight: $el.data("photo"),
                    ratio: ratio
            };
            result.pictures.push(picture);
        });
        resultHandler(result);
    };
}