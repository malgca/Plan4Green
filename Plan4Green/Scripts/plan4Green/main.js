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

    /*-----------------------------------------------------------------
    SCRIPT VARIABLES
    -------------------------------------------------------------------*/
    // the page on which stuff is drawn
    page = document.getElementById("drawing-page"),
    // drawing panel from which to get the drawing items
    drawPane = document.getElementById("drawing-pane"),

    // array of existing BS objects.
    bsObjects,

    // current level of the page.
    currentLevel,

    /*------------------------------------------------------------------------
    PAGE METHODS
    -------------------------------------------------------------------------*/
    // clear all child elements from page
    clearPage = function () {
        while (page.childElementCount > 0) {
            console.log(page.lastChild.id + " removed")
            page.removeChild(page.lastChild);
        }
    }

    // get the current position of the object in relation to the drawing page
    currentPosition = function (event) {
        // position on the screen.
        var pos = new Point(event.pageX, event.pageY);

        pos.x -= main.page.offsetLeft;
        pos.y -= main.page.offsetTop;

        return pos;
    },

    // change the current level of the drawing page
    changeLevel = function () {
        if (currentLevel == 'Perspective') {
            clearPage();
        }
        canvasObject.create('Perspective');
    }
    /*---------------------------------------------------------------------
    DOM EVENTS
    ----------------------------------------------------------------------*/
    init = function () {
        // clear the starting array.
        bsObjects = new Array();

        // set the default current level
        currentLevel = 'Perspective';

        var pageEvents = (function () {
            // mousedown event handler
            mousedown = function (event) {
                console.log(event.target);
                if (event.target === this) {
                }
            },

            // mouseup event handler
            mouseup = function (event) {
                console.log(event.target);
                if (event.target === this) {
                    changeLevel();
                }
            },

            // mousemove event handler
            mousedrag = function (event) {
                if (isUnderConstruction) {
                    var pos = currentPosition(event);
                    position.innerHTML = "(x: " + pos.x + " | y: " + pos.y + ")";
                }

                if (event.target === this) {
                }
            },

            // mouseout event handler
            mouseout = function (event) {
                if (event.target === this) {
                }
            }

            // mouse drop event handler
            mousedrop = function (event) {
            }

            // dragover event handler
            dragover = function (event) {
                event.preventDefault();
            }

            drop = function (event) {
                event.preventDefault();
                var data = event.dataTransfer.getData("thumb");

                if (data == 'perspective') {
                    // create a new perspective.
                }
                else if (data == 'goal') {
                    // createa a new goal.
                }
                else {
                    // create a new measure.
                }

                canvasObject.create('Perspective');
                count++;
            }

            // expose members
            return {
                mousedown: mousedown,
                mouseup: mouseup,
                mousedrag: mousedrag,
                mouseout: mouseout,
                dragover: dragover,
                drop: drop
            }
        }());

        drawPaneEvents = (function () {
            dragstart = function (event) {
                event.dataTransfer.setData("thumb", event.target.id);
            }

            return {
                dragstart: dragstart
            }
        }());

        // add mouse event listeners to page
        page.addEventListener("mousedown", pageEvents.mousedown, false);
        page.addEventListener("mouseup", pageEvents.mouseup, false);
        page.addEventListener("mousemove", pageEvents.mousedrag, false);
        page.addEventListener("mouseout", pageEvents.mouseout, false);
        page.addEventListener("dragover", pageEvents.dragover, false);
        page.addEventListener("drop", pageEvents.drop, false);

        drawPane.addEventListener("dragstart", drawPaneEvents.dragstart, false);
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
        currentPosition: currentPosition,
        changeLevel: changeLevel
    };
}());
