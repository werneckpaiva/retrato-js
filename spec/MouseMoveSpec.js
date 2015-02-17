describe("Mouse Timer", function() {

    it("test mouse wait without move for 50ms", function(done){
        MouseTimer.on("mousewait", 50, function(){
            done();
        });
    });

});