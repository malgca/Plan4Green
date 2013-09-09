var debug = {
    // flag set while creatings site.
    isUnderConstruction: true,

    // position information element
    position: document.getElementById("position"),
    // status informaiton element
    status: document.getElementById("status"),

    // dummy count variable
    count: 0
},

global = {
    // global bs parent reference
    bsParent: undefined,
    // array of existing BS perspectives.
    perspectiveArray: new Array()
},

main = (function () {
    var
    // the page on which stuff is drawn
    page = document.getElementById("drawing-page"),
    // the logout button
    logout = document.getElementById("logout-action"),
    // the current instruction number
    instructionNum = document.getElementById("instruction-number"),
    // the current instruction text
    instructionText = document.getElementById("instruction-text"),
    // instructions array
    instructionArray = new Array(),
    // the level of the page.
    level,

    /*------------------------------------------------------------------------
    PAGE METHODS
    -------------------------------------------------------------------------*/
    // clear all child elements from page
    clearPage = function () {
        while (page.childElementCount > 0) {
            page.removeChild(page.lastChild);
        }
    },

    drawChildren = function (bsItem) {
        var itemCount = 0;

        if (level.current == 'top') {
            var loopsEnd = global.perspectiveArray.length;
            for (var i = 0; i < loopsEnd; i++) {
                canvasObject.create(global.perspectiveArray[i], true);
            }
        }

        else {
            var loopsEnd = bsItem.children.length;
            for (var i = 0; i < loopsEnd; i++) {
                canvasObject.create(bsItem.children[i], true);
            }
        }
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
    changeLevel = function (bsItem, drillDirection) {
        clearPage();

        if (drillDirection == level.drillDown) {
            if (bsItem.type == 'perspective') {
                level.current = bsItem.type;
                drawChildren(bsItem); // draw goals
            }
            else if (bsItem.type == 'goal') {
                level.current = bsItem.type;
                drawChildren(bsItem); // draw measures
            }
        }

        else {
            if (bsItem.type == 'perspective') { // viewing goals
                global.bsParent = undefined;
                level.current = 'top';
                drawChildren(bsItem);
            }
            else if (bsItem.type == 'goal') { // viewing measures
                level.current = bsItem.type;
                drawChildren(bsItem);
            }
        }
    }
    /*---------------------------------------------------------------------
    DOM EVENTS
    ----------------------------------------------------------------------*/
    // initialize the bsPage
    init = function () {
        // set the default current level to perspective
        level = {
            current: 'top',
            drillUp: 'drillUp',
            drillDown: 'drillDown',
        }

        // populate instruction array
        var populateInstructions = function () {
            instructionArray.push("Please drag and drop a Perspective (the blue icon) onto the canvas.");
            instructionArray.push("Please drag and drop a Goal (the red icon) onto the canvas.");
            instructionArray.push("Please drag and drop a Measure (the green icon) onto the canvas.");
            instructionArray.push("Click on edit to edit the object you just dropped.");
            instructionArray.push("Click on view to view the object you just dropped.");
        }
        
        var pageEvents = (function () {
            // mousedown event handler
            mousedown = function (event) {
                if (event.target === this) {
                    // get child and find the parent, then drill up
                    if (level.current != 'top') {
                        level.current = global.bsParent.type;
                        changeLevel(global.bsParent, 'drillUp');
                    }
                }
            },

            // mousemove event handler
            mousemove = function (event) {
                if (debug.isUnderConstruction) {
                    var pos = currentPosition(event);
                    debug.position.innerHTML = "(x: " + pos.x + " | y: " + pos.y + ")";
                }
            },

            // dragover event handler
            mousedragover = function (event) {
                event.preventDefault();
            }

            mousedrop = function (event) {
                event.preventDefault();
                var data = event.dataTransfer.getData("thumb");
                var bsItem;

                switch (data) {
                    case ('perspective'):
                        if (level.current == 'top') {
                            bsItem = bsType.createPerspective(currentPosition(event));
                            global.perspectiveArray.push(bsItem);

                            drawingPane.addBSItem(bsItem);
                        }
                        break;
                    case ('goal'):
                        if (level.current == 'perspective') {
                            bsItem = bsType.createGoal(currentPosition(event));
                        }
                        break;
                    case ('measure'):
                        if (level.current == 'goal') {
                            bsItem = bsType.createMeasure(currentPosition(event));
                        }
                        break;
                }
                if (bsItem != undefined) {
                    canvasObject.create(bsItem);
                    debug.count++;
                }
            }

            // expose members
            return {
                mousedown: mousedown,
                mousemove: mousemove,
                mousedragover: mousedragover,
                mousedrop: mousedrop
            }
        }());

        // add mouse event listeners to page and drawing pane
        page.addEventListener("mousedown", pageEvents.mousedown, false);
        page.addEventListener("mousemove", pageEvents.mousemove, false);
        page.addEventListener("dragover", pageEvents.mousedragover, false);
        page.addEventListener("drop", pageEvents.mousedrop, false);

        // call the poplate instruction array method
        populateInstructions();
    }

    // initilalize the main.js script when the window loads
    window.addEventListener("load", init, false);

    // expose members
    return {
        init: init,
        page: page,
        currentPosition: currentPosition,
        changeLevel: changeLevel,
        level: level
    };
}());
