var Settings = {
    URL_PREFIX: "/",
    URL_DATA_PREFIX: "/api/"
};

var StringUtil = {
    sanitizeUrl: function(url){
        url = url.replace(/([^:])[\/]+/g, '$1/');
        return url;
    },
    humanizeName: function(name){
        name = name.replace(/_/g, " ");
        name = name.replace(/\.jpe?g/i, "");
        return name;
    }
};


var Fullscreen = {
    open: function(element){
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    },

    close: function close() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    },

    onchange: function(handler){
        document.addEventListener("fullscreenchange", handler);
        document.addEventListener("webkitfullscreenchange", handler);
        document.addEventListener("mozfullscreenchange", handler);
        document.addEventListener("MSFullscreenChange", handler);
    },

    isActive: function(){
        return document.fullscreenElement || 
        document.mozFullScreenElement || 
        document.webkitFullscreenElement || 
        document.msFullscreenElement;
    }
};

function AlbumPhotos(model, conf){

    var self = this;
    var $view = null;
    var $viewList = null;
    var template = null;
    var currentWidth = 0;
    var heightProportion = null;
    var lazyLoad = false;

    var margin = 0;

    function init(){
        setConfiguration();

        watch(model, "pictures", function(prop, action, newvalue, oldvalue){
            var picturesChanged = Array.isArray(newvalue);
            self.displayPictures(picturesChanged);
        });

        $(window).resize(function(){
            self.resizePictures();
        });
        $(window).scroll(function(){
            self.revealImages();
        });
    }

    function setConfiguration(){
        // Required
        $view = conf.view;
        template = conf.template;

        // Optional
        $viewList = (conf.listClass)? $view.find("."+conf.listClass) : $view;
        heightProportion = (conf.heightProportion)? conf.heightProportion : 0.45;
        lazyLoad = (conf.lazyLoad)? conf.lazyLoad : false;
        margin = (conf.margin)?  conf.margin : 0;
    }

    this.calculatePicturesSizes = function(width, height) {
        var resize = new Resize(model.pictures, heightProportion);
        var newPictures = resize.doResize(width, height);
        return newPictures;
    };

    this.displayPictures = function(picturesChanged){
        if (picturesChanged===false){
            return;
        }

        $viewList.empty();
        if(!model.pictures || model.pictures.length === 0){
            $view.hide();
            return;
        }
        $view.show();

        currentWidth = $view.width();
        var newPictures = self.calculatePicturesSizes(currentWidth, $(window).height());
        var content = "";
        for (var i=0; i<newPictures.length; i++){
            var p = newPictures[i];
            var params = $.extend(model.pictures[i], {
                    width: p.newWidth-margin,
                    height: p.newHeight-margin
            });
            if (!lazyLoad){
                params.src = model.pictures[i].thumb;
            }
            content += Mustache.render(template, params);
        }
        $viewList.html(content);
        $viewList.find("img")
            .each(function(i, el){
                $(el).data("index", i);
            })
            .click(function(){
                model.selectedPictureIndex = $(this).data("index");
            });
        if (lazyLoad){
            startLazyLoading();
        } else {
            self.revealImages();
        }
    };

    this.resizePictures = function(){
        var newWidth = $view.width();
        if (newWidth == currentWidth) return;
        currentWidth = $view.width();
        var newPictures = self.calculatePicturesSizes(currentWidth, $(window).height());
        $viewList.children().each(function(index, item){
            var p = newPictures[index];
            var width = (p.newWidth-margin);
            var height = (p.newHeight-margin);
            $(this).css("width", width).css("height", height);
            $(this).find("img").attr("width", width).attr("height", height);
        });
        self.revealImages();
    };

    function startLazyLoading(){

        function loadNextPicture(){
            if (index >= model.pictures.length){
                return;
            }
            self.revealImages();
            if (image.src == model.pictures[index].thumb){
                index++;
                loadNextPicture();
            } else {
                image.src = model.pictures[index].thumb;
            }
        }
        $viewList.find("img").hide();
        var index = 0;
        var image = new Image();
        image.onload = function(){
            $viewList.find("img:eq("+index+")")
                  .data("img-src", this.src);
//                .attr("src", this.src)
//                .show();
            index++;
            loadNextPicture();
        };

        loadNextPicture();
    }

    this.revealImages = function(){
        var scrollTop = $(window).scrollTop();
        var positionTop = ($viewList.parent().position())? $viewList.parent().position().top : 0;
        var bottom = scrollTop + positionTop + $viewList.parent().height() - 30;
        $viewList.find("img[src='']").each(function(index, item){
            $item = $(item);
            if ($item.parent().position().top <= bottom){
                $item.hide().attr("src", $item.data("img-src")).fadeIn(1000);
            }
        });
    };

    init();
}