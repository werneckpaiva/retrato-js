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
       return document.fullScreenElement !== null || 
           document.webkitCurrentFullScreenElement !== null || 
           document.mozFullScreenElement !== null || 
           document.msFullscreenElement !== null;
    }
};


function AlbumMenu(model, conf){

    var self = this;

    var $view = null;
    var $detailsButton = null;
    var $fullscreenButton = null;

    function init(){
        $view = conf.view;
        $detailsButton = conf.detailsButton;
        $fullscreenButton = conf.fullscreenButton;

        watch(model, "selectedPictureIndex", function(){
            pinMenu();
            showHideDetailsButton();
            showHideFullscreenButton();
        });

        $detailsButton.click(function(event){
            event.preventDefault();
            showHideDetails();
        });

        $fullscreenButton.click(function(event){
            event.preventDefault();
            openCloseFullscreen();
        });

        Fullscreen.onchange(function(event){
            $fullscreenButton.toggleClass("selected", Fullscreen.isActive());
        });
        
        showHideDetailsButton();
        showHideFullscreenButton();
    }

    function pinMenu(){
        if (model.selectedPictureIndex !== null){
            $view.addClass("headroom--pinned").addClass("headroom--top");
            $view.removeClass("headroom--not-top").removeClass("headroom--unpinned");
        }
    }

    function showHideDetailsButton(){
        if (model.selectedPictureIndex === null){
            model.detailsOn = false;
            $detailsButton.hide();
        } else {
            $detailsButton.show();
        }
    }

    function showHideDetails(){
        model.detailsOn = !model.detailsOn;
        $detailsButton.toggleClass("selected", model.detailsOn);
    }

    function showHideFullscreenButton(){
        if (model.selectedPictureIndex === null){
            model.detailsOn = false;
            $fullscreenButton.hide();
        } else {
            $fullscreenButton.show();
        }
    }

    function openCloseFullscreen(){
        if (Fullscreen.isActive()){
            Fullscreen.close();
        } else {
            Fullscreen.open(document.getElementById("content"));
        }
    }

    init();
}


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

        var resize = new Resize(model.pictures, heightProportion);
        currentWidth = $view.width();
        var newPictures = resize.doResize(currentWidth, $(window).height());

        var content = "";
        for (var i=0; i<newPictures.length; i++){
            var p = newPictures[i];
            var params = {
                    width: p.newWidth-margin,
                    height: p.newHeight-margin
            };
            if (!lazyLoad){
                params.src = model.pictures[i].thumb;
            }
            content += Mustache.render(template, params);
        }
        $viewList.html(content);
        $viewList.find("img").click(function(){
            model.selectedPictureIndex = $(this).data("index");
        });
        if (lazyLoad){
            startLazyLoading();
        }
    };

    this.resizePictures = function(){
        var newWidth = $view.width();
        if (newWidth == currentWidth) return;
        currentWidth = $view.width();
        var resize = new Resize(model.pictures, heightProportion);
        var newPictures = resize.doResize(currentWidth, $(window).height());
        $viewList.children().each(function(index, item){
            var p = newPictures[index];
            var width = (p.newWidth-margin);
            var height = (p.newHeight-margin);
            $(this).css("width", width).css("height", height);
            $(this).find("img").attr("width", width).attr("height", height);
        });
    };

    function startLazyLoading(){

        function loadNextPicture(){
            if (index >= model.pictures.length){
                return;
            }
            $viewList.find("img:eq("+index+")").data("index", index);
            if (image.src == model.pictures[index].thumb){
                index++;
                loadNextPicture();
            } else {
                image.src = model.pictures[index].thumb;
            }
        }

        var index = 0;
        var image = new Image();
        image.onload = function(){
            $viewList.find("img:eq("+index+")")
                .attr("src", this.src)
                .show();
            index++;
            loadNextPicture();
        };

        loadNextPicture();
    }

    init();
};function Highlight(model, conf){
    var self = this;

    var $view = null;
    var $viewList = null;
    var template = null;
    var $detailsView = null;

    var currentPictureIndex = null;
    var currentFrame = null;
    var prevFrame = null;
    var nextFrame = null;

    var isOpened = false;

    var padding = 15;
    var headerHeight = 45;
    
    function init(){
        $view = conf.view;
        $viewList = (conf.listClass)? $view.find("."+conf.listClass) : $view;
        template = conf.template;
        $detailsView = conf.detailsView;

        watch(model, "selectedPictureIndex", function(){
            onPictureSelected();
            updateDetailValues();
        });
        watch(model, "detailsOn", function(){
            if (model.detailsOn){
                showDetails();
            } else {
                hideDetails();
            }
        });

        $view.click(function(){
            self.close();
        });

        $(window).resize(function(){
            self.updateDisplay();
        });

        $('body').keyup(function (event) {
            if (event.keyCode == 37){
                self.displayPrevPicture();
            } else if (event.keyCode == 39){
                self.displayNextPicture();
            } else if (event.keyCode == 27){
                self.close();
            }
        });
    }

    function onPictureSelected(){
        if (isOpened) {
            if (model.selectedPictureIndex === null){
                self.close();
            }
            return;
        }
        self.handleScroll();
        self.displayPicture();
    }
    
    function disableScroll(e){
        if (e.target.id == 'el') return;
        e.preventDefault();
        e.stopPropagation();
    }
    
    this.handleScroll = function(){
        $('body').on('mousewheel', disableScroll);
    };

    this.unhandleScroll = function(){
        $('body').off('mousewheel', disableScroll);
    };

    this.hasPicturesToDisplay = function(){
        return (model.selectedPictureIndex !== null && 
                model.selectedPictureIndex >= 0 && 
                model.pictures && 
                model.pictures.length>=0);
    };

    this.close = function(){
        isOpened = false;
        self.unhandleScroll();
        $view.fadeOut("slow");
        model.selectedPictureIndex = null;
        Fullscreen.close();
    };

    function createHighlight(){
        var $frame = $(Mustache.render(template, {}));
        return $frame;
    }

    this.displayPicture = function(){
        if (!self.hasPicturesToDisplay()){
            self.close();
            return;
        }
        isOpened = true;
        $viewList.empty();
        createCurrentHighlight();
        createLeftHighlight();
        createRightHighlight();
        self.updateDisplay();
    };

    // Move from left to right
    this.displayPrevPicture = function(){
        if (!self.hasPicturesToDisplay()) return;
        $viewList.find(".large-photo").stop();
        if (model.selectedPictureIndex === 0) return;

        var newRightPicture = model.pictures[model.selectedPictureIndex];
        model.selectedPictureIndex--;

        var newCurrentFrame = prevFrame;
        newCurrentFrame.removeClass("prev-frame").addClass("current-frame");
        var newCurrentPicture = model.pictures[model.selectedPictureIndex];
        var newCurrentDimension = calculateDimension(newCurrentPicture);
        newCurrentFrame.find(".box-blur").hide();
        newCurrentFrame.find(".large-photo").animate({
            left: newCurrentDimension.x
        }, 500, "swing", function(){
            showBlur(newCurrentFrame, newCurrentPicture);
            showHighResolution(newCurrentFrame, newCurrentPicture);
        });

        var newRightFrame = currentFrame;
        newRightFrame.removeClass("current-frame").addClass("next-frame");
        var newRightDimension = calculateDimensionRight(newRightPicture);
        newRightFrame.find(".large-photo").animate({
            left: newRightDimension.x
        }, 500, "swing");

        if (nextFrame) nextFrame.remove();
        nextFrame = currentFrame;
        currentFrame = prevFrame;
        prevFrame = null;

        // Set Image to the new Left
        if (model.selectedPictureIndex > 0){
            createLeftHighlight();
            var newLeftPicture = model.pictures[model.selectedPictureIndex - 1];
            var dimension = calculateDimensionLeft(newLeftPicture);
            setPosition(prevFrame, dimension);
            showLowResolution(prevFrame, newLeftPicture);
        }
    };

    // Move from right to left
    this.displayNextPicture = function(){
        if (!self.hasPicturesToDisplay()) return;
        $viewList.find(".large-photo").stop();
        if (model.selectedPictureIndex >= (model.pictures.length - 1)) return;

        var newLeftPicture = model.pictures[model.selectedPictureIndex];
        model.selectedPictureIndex++;

        var newCurrentFrame = nextFrame;
        newCurrentFrame.removeClass("next-frame").addClass("current-frame");
        var newCurrentPicture = model.pictures[model.selectedPictureIndex];
        var newCurrentDimension = calculateDimension(newCurrentPicture);
        newCurrentFrame.find(".box-blur").hide();
        newCurrentFrame.find(".large-photo").animate({
            left: newCurrentDimension.x
        }, 500, "swing", function(){
            showBlur(newCurrentFrame, newCurrentPicture);
            showHighResolution(newCurrentFrame, newCurrentPicture);
        });

        var newLeftFrame = currentFrame;
        newLeftFrame.removeClass("current-frame").addClass("prev-frame");
        var newLeftDimension = calculateDimensionLeft(newLeftPicture);
        newLeftFrame.find(".large-photo").animate({
            left: newLeftDimension.x
        }, 500, "swing");

        if (prevFrame) prevFrame.remove();
        prevFrame = currentFrame;
        currentFrame = nextFrame;
        nextFrame = null;

        // Set Image to the new Right
        if (model.selectedPictureIndex < (model.pictures.length - 1)){
            createRightHighlight();
            var newRightPicture = model.pictures[model.selectedPictureIndex + 1];
            var dimension = calculateDimensionRight(newRightPicture);
            setPosition(nextFrame, dimension);
            showLowResolution(nextFrame, newRightPicture);
        }
    };

    function createCurrentHighlight(){
        currentFrame = createHighlight();
        currentFrame.addClass("current-frame");
        $viewList.append(currentFrame);
    }

    function createLeftHighlight(){
        if (prevFrame) prevFrame.remove();
        prevFrame = createHighlight();
        prevFrame.addClass("prev-frame");
        $viewList.append(prevFrame);
    }

    function createRightHighlight(){
        if (nextFrame) nextFrame.remove();
        nextFrame = createHighlight();
        nextFrame.addClass("next-frame");
        $viewList.append(nextFrame);
    }

    this.updateDisplay = function(){
        if (!self.hasPicturesToDisplay()) return;
        if (!isOpened) return;
        $view.fadeIn("slow");
        var picture, dimension;
        if (currentFrame) {
            picture = model.pictures[model.selectedPictureIndex].
            dimension = calculateDimension(picture);
            setPosition(currentFrame, dimension);
            showLowResolution(currentFrame, picture);
            showHighResolution(currentFrame, picture);
            if (!currentFrame.find('.box-blur').is(':visible')){
                showBlur(currentFrame, picture);
            }
        }
        if (prevFrame && model.selectedPictureIndex > 0) {
            picture = model.pictures[model.selectedPictureIndex - 1];
            dimension = calculateDimensionLeft(picture);
            setPosition(prevFrame, dimension);
            showLowResolution(prevFrame, picture);
        }
        if (nextFrame && model.selectedPictureIndex < model.pictures.length - 1) {
            picture = model.pictures[model.selectedPictureIndex + 1];
            dimension = calculateDimensionRight(picture);
            setPosition(nextFrame, dimension);
            showLowResolution(nextFrame, picture);
        }
    };

    function calculateDimension(picture){
        var $window = $view;
        var windowWidth = $window.width();
        var windowHeight = $window.height();

        if (model.detailsOn){
            windowWidth -= $detailsView.width();
        }

        var newWidth = windowWidth - (padding * 2);
        var newHeight = Math.round(newWidth / picture.ratio);
        var x = 0;
        var y = Math.round((windowHeight - newHeight) / 2);
        if (y < headerHeight){
            newHeight = windowHeight - (headerHeight + (padding * 2));
            newWidth = Math.round(newHeight * picture.ratio);
            y = 0;
            x = Math.round(($window.width() - newWidth) / 2);
        }
        x = (windowWidth - newWidth) / 2;
        y = ((windowHeight - headerHeight - newHeight) / 2) + headerHeight;
        return {newWidth: newWidth, newHeight: newHeight, x:x, y:y};
    }

    function calculateDimensionLeft(picture){
        var dimension = calculateDimension(picture);
        dimension.x = -1 * dimension.newWidth - 50;
        return dimension;
    }

    function calculateDimensionRight(picture){
        var dimension = calculateDimension(picture);
        dimension.x = $view.width() + 50;
        return dimension;
    }

    function showHighResolution(frame, picture){
        var $highRes = frame.find(".high-res");
        $highRes.hide();

        image = new Image();
        image.onload = function(){
            $highRes.attr("src", this.src);
            $highRes.fadeIn();
        };
        image.src = picture.highlight;
    }

    function showLowResolution(frame, picture){
        var $lowRes = frame.find(".low-res");
        $lowRes.attr("src", picture.thumb);
    }

    function setPosition(frame, dimension){
        var largePhoto = frame.find(".large-photo");
        largePhoto.css("left", dimension.x+"px").css("top", dimension.y+"px");
        largePhoto.css("width", dimension.newWidth+"px").css("height", dimension.newHeight+"px");
    }

    function animateToPosition(frame, dimension){
        currentFrame.find(".large-photo").animate({
            left:dimension.x,
            top: dimension.y,
            width: dimension.newWidth,
            height: dimension.newHeight
        }, 500);
    }

    function showBlur(frame, picture){
        self.blurTimeout = setTimeout(function(){
            var blur = frame.find('.box-blur').hide();
            blur.fadeIn(2000);
            boxBlurImage(frame.find('.low-res').get(0), blur.get(0), 20, false, 2);
            blur.show();
        }, 500);
    }

    function showDetails(){
        $detailsView.animate({right: 0}, 500);
        var p = model.pictures[model.selectedPictureIndex];
        var dimension = calculateDimension(p);
        animateToPosition(currentFrame, dimension);
    }

    function hideDetails(){
        $detailsView.animate({right: -$detailsView.width()}, 500);
        if (currentFrame){
            var p = model.pictures[model.selectedPictureIndex];
            var dimension = calculateDimension(p);
            animateToPosition(currentFrame, dimension);
        }
    }

    function updateDetailValues(){
        var picture = model.pictures[model.selectedPictureIndex];
        if (!picture) return;
        $detailsView.find(".file-name").html(picture.filename);
        $detailsView.find(".file-date").html(picture.date);
        $detailsView.find(".file-width").html(picture.width);
        $detailsView.find(".file-height").html(picture.height);
    }

    init();
}
;function AlbumModel(albumDelegate){

    var delegate = albumDelegate;
    var self = this;

    this.path = null;
    this.albuns = null;
    this.pictures = null;
    this.visibility = null;

    this.loading = false;

    this.selectedPictureIndex = null;
    this.highlightOn = false;
    this.detailsOn = false;

    this.loadAlbum = function(albumPath){
        self.loading = true;
        delegate.get(albumPath, loadAlbumResultHandler, loadAlbumFailHandler);
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
        if (imgs.length === 0){
            return failHandler();
        }
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
};function Resize(pictures, heightProportion){
    this.pictures = pictures;
    this.HEIGHT_PROPORTION = 0.45;
    if (heightProportion){
        this.HEIGHT_PROPORTION = heightProportion;
    }
}

Resize.prototype.doResize = function(viewWidth, viewHeight){
    viewWidth--;
    var idealHeight = parseInt(viewHeight * this.HEIGHT_PROPORTION);

    var sumWidths = this.sumWidth(idealHeight);
    var rows = Math.ceil(sumWidths / viewWidth);

//    if (rows <= 1){
//        // fallback to standard size
//        console.log("1 row")
//        this.resizeToSameHeight(idealHeight)
//    } else {
      return this.resizeUsingLinearPartitions(rows, viewWidth);
//    }
};

Resize.prototype.sumWidth = function(height){
    var sumWidths = 0;
    var p;
    for (var i in this.pictures){
        p = this.pictures[i];
        sumWidths += p.ratio * height;
    }
    return sumWidths;
};

Resize.prototype.resizeToSameHeight = function(height){
    var p;
    for (var i in this.pictures){
        p = this.pictures[i];
        p.newWidth = parseInt(height * p.ratio);
        p.newHeight = height;
    }
    return this.pictures;
};

Resize.prototype.resizeUsingLinearPartitions = function(rows, viewWidth){
    var weights = [];
    var p, i, j;
    for (i in this.pictures){
        p = this.pictures[i];
        weights.push(parseInt(p.ratio * 100));
    }
    var partitions = linearPartition(weights, rows);
    var index = 0;
    var newDimensions = [];
    for(i in partitions){
        partition = partitions[i];
        var rowList = [];
        for(j in partition){
            rowList.push(this.pictures[index]);
            index++;
        }
        var summedRatios = 0;
        for (j in rowList){
            p = rowList[j];
            summedRatios += p.ratio;
        }
        var rowHeight = (viewWidth / summedRatios);
        var rowWidth = 0;
        for (j in rowList){
            p = rowList[j];
            var dimension = {};
            dimension.newWidth = parseInt(rowHeight * p.ratio);
            rowWidth += dimension.newWidth;
            dimension.newHeight = parseInt(rowHeight);
            newDimensions.push(dimension);
        }
    }
    return newDimensions;
};

function linearPartition(seq, k){
    if (k <= 0){
        return [];
    }

    var n = seq.length - 1;
    var partitions = [];
    if (k > n){
        for (var i in seq){
            partitions.push([seq[i]]);
        }
        return partitions;
    }
    var solution = linearPartitionTable(seq, k);
    k = k - 2;
    var ans = [];
    while (k >= 0){
        var partial = seq.slice(solution[n-1][k]+1, n+1);
        ans = [partial].concat(ans);
        n = solution[n-1][k];
        k = k - 1;
    }
    ans = [seq.slice(0, n+1)].concat(ans);
    return ans;
}

function linearPartitionTable(seq, k){
    var n = seq.length;
    var table = [];
    var row = [];
    var i, j, x;
    for (i=0; i<k; i++) row.push(0);
    for (i=0; i<n; i++) table.push( row.slice() );

    var solution = [];
    row = [];
    for (i=0; i<(k-1); i++) row.push(0);
    for (i=0; i<(n-1); i++) solution.push( row.slice() );

    for (i=0; i<n; i++){
        var value = seq[i];
        if (i>0){
            value += table[i-1][0];
        }
        table[i][0] = value;
    }
    for (j=0; j<k; j++){
        table[0][j] = seq[0];
    }
    for (i=1; i<n; i++){
        for (j=1; j<k; j++){
            var min = null;
            var minx = null;
            for (x = 0; x < i; x++) {
                var cost = Math.max(table[x][j - 1], table[i][0] - table[x][0]);
                if (min === null || cost < min) {
                    min = cost;
                    minx = x;
                }
            }
            table[i][j] = min;
            solution[i - 1][j - 1] = minx;
        }
    }
    return solution;
}
