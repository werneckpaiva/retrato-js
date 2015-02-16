function MouseTimer(){
    timers = {};

    listenersWait = {};
    listenersMove = [];

    function init(){
        setMouseMoveHandler();
    }

    function setMouseMoveHandler(){
        $(document).mousemove(function( event ) {
            for (var time in timers){
                var timerList = timers[time];
                for (var timer in timerList){
                    clearTimeout(timer);
                }
                addTimer(time);
            }
            for (var handler in listenersMove) {
                handler();
            }
        });
    }

    function addTimer(time){
        if (!timers[time]) {
            timers[time] = setTimeout(function(){
                for (var i in listenersWait[time]){
                    var handler = listenersWait[time][i];
                    handler();
                }
            }, time);
        }
    }
        
    this.mousewait = function(time, handler){
        if (!listenersWait[time]){
            listenersWait[time] = [];
        }
        listenersWait[time].push(handler);
        addTimer(time);
    };

    this.mousemove = function(handler){
        listenersMove.push(handler);
    };

    init();
}

var MouseTimer = new MouseTimer();
//var timer = null;
//function mouseStoppedCallback(){
//    timer = setTimeout(function(){
//        if (model.selectedPictureIndex !== null) toggleMenu(true);
//    }, 1500);
//}
//$(document).mousemove(function( event ) {
//    clearTimeout(timer);
//    if (model.selectedPictureIndex !== null) toggleMenu(false);
//    mouseStoppedCallback();
//});
//mouseStoppedCallback();