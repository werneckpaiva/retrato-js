// Mock Fullscreen API
window.Fullscreen = {
    open: function() {},
    close: function() {},
    onchange: function() {},
    isActive: function() { return false; }
};

// Mock alert to prevent blocking tests
window.alert = function(msg) { console.log("ALERT:", msg); };
