// image ref: http://www.duperrin.com/wp-content/uploads/2008/03/strategy-maps-overview-image.gif
// draw perspectives down the sides, goals and measures in balloons.
var strategyMap = (function () {
    var
        map = {
            page: document.getElementById('map-page'),
            table: document.getElementById('map-table')
        },

        drawItem = function (bsItem) {
            // disable the item for the case of strategy mapping
            bsItem.disableItem();
        },

        // draw a strategy map of the entire BS structure.
        drawMap = function () {
            // clear the entire page, move to the perspective view, then draw a strategy map right there. blam!
            // feed in the global.perspectiveArray and draw down.
            // easiest way to keep space is to just draw the images that already exist with baloons next to them telling what is what. Make them clickable for navigation and you'r done.
            if (global.perspectiveArray.length > 0) {
                main.viewItem(global.perspectiveArray[0], true);

                main.page.style.display = 'none';
                map.page.style.display = 'block';

                main.viewParentImage.src = '../../Images/controls/drawing-page/exit-icon.png';
                global.isGraphing = true;

                for (var i = 0; i < global.perspectiveArray; i++) {
                    drawItem(global.perspectiveArray[i]);

                }
            }
            else {
                alert('Please ensure that there is at least one perspective before attempting to draw a strategy map.');
            }
        },

        draw = function() {
            drawMap();
        }
    return {
        draw: draw
    }
}());