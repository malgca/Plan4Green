var strategyMap = (function () {
    var
        // draw a strategy map of the entire BS structure.
        drawMap = function () {
            // clear the entire page, move to the perspective view, then draw a strategy map right there. blam!
            // feed in the global.perspectiveArray and draw down.
            // easiest way to keep space is to just draw the images that already exist with baloons next to them telling what is what. Make them clickable for navigation and you'r done.
            main.clearPage();
        },

        draw = function() {
            drawMap();
        }
    return {
        draw: draw
    }
}());