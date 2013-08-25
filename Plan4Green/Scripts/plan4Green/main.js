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

    drawPane = {
        // drawing pane housing all drawing tools
        pane: document.getElementById("drawing-pane"),
        // perspective control in drawing pane
        perspective: document.getElementById("perspective"),
        // goal control in drawing pane
        goal: document.getElementById("goal"),
        // measure control in drawing pane
        measure: document.getElementById("measure")
    },

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
            page.removeChild(page.lastChild);
        }
    },

    redrawPage = function (levelItem) {

    },

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
                if (event.target === this) {
                    changeLevel();
                }
            },

            // mouseup event handler
            mouseup = function (event) {
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
                var bsItem;

                if (data == 'perspective') {
                    if (bsObjects.length < 6000) {
                        bsItem = bsType.createPerspective(currentPosition(event));
                        // add it to the bsObjects
                        bsObjects.push(bsItem);
                        redrawPage();
                    }
                }
                else if (data == 'goal') {
                    bsItem = bsType.createGoal(currentPosition(event));
                    redrawPage();
                }
                else {
                    bsItem = bsType.createMeasure(currentPosition(event));
                    redrawPage();
                }

                canvasObject.create(bsItem);
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

            perspectivemouseover = function (event) {
                drawPane.perspective.src = "../../Images/drawing-tools/perspective-active-icon.png";
            }
            
            perspectivemouseout = function (event) {
                drawPane.perspective.src = "../../Images/drawing-tools/perspective-inactive-icon.png";
            }

            goalmouseover = function (event) {
                drawPane.goal.src = "../../Images/drawing-tools/goal-active-icon.png";
            }

            goalmouseout = function (event) {
                drawPane.goal.src = "../../Images/drawing-tools/goal-inactive-icon.png";
            }


            measuremouseover = function (event) {
                drawPane.measure.src = "../../Images/drawing-tools/measure-active-icon.png";
            }

            measuremouseout = function (event) {
                drawPane.measure.src = "../../Images/drawing-tools/measure-inactive-icon.png";
            }

            return {
                dragstart: dragstart,
                perspectivemouseover: perspectivemouseover,
                perspectivemouseout: perspectivemouseout,
                goalmouseover: goalmouseover,
                goalmouseout: goalmouseout,
                measuremouseover: measuremouseover,
                measuremouseout: measuremouseout,
            }
        }());

        // add mouse event listeners to page and drawing pane
        page.addEventListener("mousedown", pageEvents.mousedown, false);
        page.addEventListener("mouseup", pageEvents.mouseup, false);
        page.addEventListener("mousemove", pageEvents.mousedrag, false);
        page.addEventListener("mouseout", pageEvents.mouseout, false);
        page.addEventListener("dragover", pageEvents.dragover, false);
        page.addEventListener("drop", pageEvents.drop, false);

        drawPane.pane.addEventListener("dragstart", drawPaneEvents.dragstart, false);
        drawPane.perspective.addEventListener("mouseover", drawPaneEvents.perspectivemouseover, false);
        drawPane.perspective.addEventListener("mouseout", drawPaneEvents.perspectivemouseout, false);
        drawPane.goal.addEventListener("mouseover", drawPaneEvents.goalmouseover, false);
        drawPane.goal.addEventListener("mouseout", drawPaneEvents.goalmouseout, false);
        drawPane.measure.addEventListener("mouseover", drawPaneEvents.measuremouseover, false);
        drawPane.measure.addEventListener("mouseout", drawPaneEvents.measuremouseout, false);
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
