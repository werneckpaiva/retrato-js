describe("Mouse Timer", function() {

    it("test mouse wait without move for 50ms", function(done){
        MouseTimer.mousewait(50, function(){
            done();
        });
    });

});