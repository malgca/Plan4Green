var main = (function () {
    var
    /*-----------------------------------------------------------------
    BUILDING VARIABLES
    -------------------------------------------------------------------*/
    // flag set while creatings site.
    isUnderConstruction = true,
    // elements to show building information
    position = document.getElementById("position"),
    status = document.getElementById("status"),

    // dummy count
    count = 0,

    /*------------------------------------------------------------------------
    PAGE METHODS
    -------------------------------------------------------------------------*/
    // Returns the current level of the app.
    getCurrentLevel = function (name, type) {
        if (typeof type == null) {
            return "All Perspectives";
        }
        else {
            return typeof type + ": " + name;
        }
    }

    /*-----------------------------------------------------------------
    SCRIPT VARIABLES
    -------------------------------------------------------------------*/
    // the page on which stuff is drawn
    page = document.getElementById("drawing-page"),

    // array of existing BS objects.
    bsObjects,

    // current level of the page.
    currentLevel,


            // get the current position of the object in relation to the drawing page
        currentPosition = function (event) {
            // position on the screen.
            var pos = new Point(event.pageX, event.pageY);

            pos.x -= main.page.offsetLeft;
            pos.y -= main.page.offsetTop;

            return pos;
        },

    /*---------------------------------------------------------------------
    DOM EVENTS
    ----------------------------------------------------------------------*/
    init = function () {
        var

        // clear the starting array.
        bsObjects = new Array(),

        // mousedown event handler
        mousepressed = function (event) {
        },

        // mouseup event handler
        mousereleased = function (event) {
        },

        // mousemove event handler
        mousedragged = function (event) {
            if (isUnderConstruction) {
                var pos = currentPosition(event);
                position.innerHTML = "(x: " + pos.x + " | y: " + pos.y + ")";
            }
        },

        // mouseout event handler
        mousecancelled = function (event) {
        };

        // add mouse event listeners to page
        page.addEventListener("mousedown", mousepressed, false);
        page.addEventListener("mouseup", mousereleased, false);
        page.addEventListener("mousemove", mousedragged, false);
        page.addEventListener("mouseout", mousecancelled, false);

        for (var i = 0; i < 2; i++) {
            canvasObject.create('Perspective');
            count++;
        }
    }

    // initilalize the main.js script when the window loads
    window.onload = init;

    // expose members
    return {
        init: init,
        page: page,
        bsObjects: bsObjects,
        count: count,
        position: position,
        status: status,
        currentPosition: currentPosition
    };
}());
