function Highlight(model, conf){
    var self = this;

    var $view = null;
    var $viewList = null;
    var template = null;
    var $detailsView = null;

    var currentPictureIndex = null;
    var currentFrame = null;

    var isOpened = false;

    var padding = 10;

    var $blurContainer = null;

    var MOUSE_WAIT_TIMEOUT = 2000;
    
    var $btnPrev = null;
    var $btnNect = null;

    function init(){
        setConfiguration();

        create$blurContainer();
        createNavArrows();

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

        $blurContainer.click(function(){
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

    function setConfiguration(){
        // Required
        $view = conf.view;
        template = conf.template;

        // Optional
        $viewList = (conf.listClass)? $view.find("."+conf.listClass) : createFramesContainer();
        $detailsView = (conf.detailsView)? conf.detailsView : [];
    }

    function createFramesContainer(){
        var $container = $("<div class='frame-container'></div>");
        $view.append($container);
        return $container;
    }

    function create$blurContainer(){
        $blurContainer = $('<div class="blur-container"></div>');
        $view.append($blurContainer);
        return $blurContainer;
    }

    function createNavArrows(){
        $btnPrev = $("<button class='btn-prev'><span>&lt;</span></button>");
        $btnNext = $("<button class='btn-next'><span>&gt;</span></button>");
        $btnPrev.click(function(){
            self.displayPrevPicture();
        });
        $btnNext.click(function(){
            self.displayNextPicture();
        });
        $view.append($btnPrev);
        $view.append($btnNext);
    }

    function onPictureSelected(){
        if (isOpened) {
            if (model.selectedPictureIndex === null){
                self.close();
            }
            return;
        }
        self.handleScroll();

        MouseTimer.on("mousewait", MOUSE_WAIT_TIMEOUT, hideArrows);
        $(document).on("mousemove", showArrows)

        self.displayPicture();
        $blurContainer.empty();
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

    function showArrows(){
        $btnPrev.fadeIn();
        $btnNext.fadeIn();
    }

    function hideArrows(){
        $btnPrev.fadeOut();
        $btnNext.fadeOut();
    }

    function repositionArrows(){
        var height = $view.height()
        var top = height / 2;
        $btnPrev.css("top", top - $btnPrev.height() / 2);
        $btnNext.css("top", top - $btnNext.height() / 2);
    }

    this.hasPicturesToDisplay = function(){
        return (model.selectedPictureIndex !== null && 
                model.selectedPictureIndex >= 0 && 
                model.pictures && 
                model.pictures.length>=0);
    };

    this.close = function(){
        isOpened = false;
        self.unhandleScroll();
        MouseTimer.off("mousewait", MOUSE_WAIT_TIMEOUT, hideArrows);
        $(document).off("mousemove", showArrows)
        $view.fadeOut("slow");
        model.selectedPictureIndex = null;
        Fullscreen.close();
    };

    function createHighlight(){
        var $frame = $(Mustache.render(template, {}));
        return $frame;
    }

    function createCanvas(){
        var $canvas = $('<canvas class="blur"/>');
        $blurContainer.append($canvas);
        return $canvas;
    }

    this.displayPicture = function(){
        if (!self.hasPicturesToDisplay()){
            self.close();
            return;
        }
        isOpened = true;
        $viewList.empty();
        createCurrentHighlight();
        self.updateDisplay();
    };

    this.displayNextPicture = function(){
        if (!self.hasPicturesToDisplay()) return;
        $viewList.find(".large-photo").stop();
        if (model.selectedPictureIndex >= (model.pictures.length - 1)) return;

        model.selectedPictureIndex++;

        self.showCurrentSelectedPicture();

    };

    this.displayPrevPicture = function(){
        if (!self.hasPicturesToDisplay()) return;
        $viewList.find(".large-photo").stop();
        if (model.selectedPictureIndex === 0) return;

        model.selectedPictureIndex--;

        self.showCurrentSelectedPicture();
    };

    this.showCurrentSelectedPicture = function(){
        var previousFrame = currentFrame;
        if (previousFrame !== null){
            previousFrame.remove();
        }
        createCurrentHighlight();
        self.updateDisplay();
    };

    function createCurrentHighlight(){
        currentFrame = createHighlight();
        currentFrame.addClass("current-frame");
        $viewList.append(currentFrame);
    }

    this.updateDisplay = function(){
        if (!self.hasPicturesToDisplay()) return;
        if (!isOpened) return;
        $view.show();
        if (currentFrame) {
            var picture = model.pictures[model.selectedPictureIndex];
            var dimension = calculateDimension(picture);
            currentFrame.find(".large-photo").addClass("visible");
            setPosition(currentFrame, dimension);
            repositionArrows();
            showLowResolution(currentFrame, picture);
            showHighResolution(currentFrame, picture);
            showBlur(currentFrame, picture);
            
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
        if (y < 0){
            newHeight = windowHeight - (padding * 2);
            newWidth = Math.round(newHeight * picture.ratio);
            y = 0;
            x = Math.round(($window.width() - newWidth) / 2);
        }
        x = (windowWidth - newWidth) / 2;
        y = (windowHeight - newHeight) / 2;
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
        clearTimeout(self.blurTimeout);
        self.blurTimeout = setTimeout(function(){
            $blurContainer.children().fadeOut(2000, function(){
                $(this).remove();
            });
            var $blur = createCanvas();
            boxBlurImage(frame.find('.low-res').get(0), $blur.get(0), 20, false, 2);
            $blur.fadeIn(1000);
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
