function MouseTimer(){
    timers = {};

    listenersWait = {};

    function init(){
        setMouseMoveHandler();
    }

    function setMouseMoveHandler(){
        $(document).mousemove(function(event) {
            for (var time in timers){
                var timer = timers[time];
                clearTimeout(timer);
                delete timers[time];
                addTimer(time);
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

    function mousewait(time, handler){
        if (!listenersWait[time]){
            listenersWait[time] = [];
        }
        listenersWait[time].push(handler);
        addTimer(time);
    }

    this.on = function(event, time, handler){
        if (event.toLowerCase() == "mousewait"){
            mousewait(time, handler);
        }
    };

    this.off = function(event, time, handler){
        if (event.toLowerCase() == "mousewait"){
            if (!listenersWait[time]) return;
            var pos = listenersWait[time].indexOf(handler);
            if (pos >= 0){
                listenersWait[time].splice(pos, 1);
            }
        }
    };

    init();
}

var MouseTimer = new MouseTimer();
