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
    // current level viewed
    bsLevel: undefined,
    // global bs item reference
    bsParent: undefined,
    // array of existing BS perspectives.
    perspectiveArray: new Array()
},

main = (function () {
    var
    // the page on which stuff is drawn
    page = document.getElementById("drawing-page"),
    // the logout button
    viewParentImage = document.getElementById("viewParentImage"),
    // the current instruction number
    instructionNum = document.getElementById("instruction-number"),
    // the current instruction text
    instructionText = document.getElementById("instruction-text"),
    // instructions array
    instructionArray = new Array(),

    // get the current position of the object in relation to the drawing page
    currentPosition = function (event) {
        // position on the screen.
        var pos = new Point(event.pageX, event.pageY);

        pos.x -= main.page.offsetLeft;
        pos.y -= main.page.offsetTop;

        return pos;
    },

    // clear all child elements from page
    clearPage = function () {
        while (page.childElementCount > 0) {
            page.removeChild(page.lastChild);
        }
    },

    // draw the parents or children of a bsItem
    viewItem = function (bsItem, viewParent) {
        console.log(bsItem.type);

        // viewing parents
        if (viewParent) {
            // viewing goals
            if (bsItem.type == 'perspective') {
                clearPage();

                for (var i = 0; i < global.perspectiveArray.length; i++) {
                    canvasObject.create(global.perspectiveArray[i]);
                }
            }
            else if (bsItem.type == 'goal') { // viewing measures
                clearPage();

                for (var i = 0; i < bsItem.bsParent.children.length; i++) {
                    canvasObject.create(bsItem.bsParent.children[i]);
                }
            }
        }
        else { // viewing children
            clearPage();

            for (var i = 0; i < bsItem.children.length; i++) {
                canvasObject.create(bsItem.children[i]);
            }
        }
    },

    // initialize the bsPage
    init = function () {
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
                    viewItem(global.bsParent, true);
                    global.bsParent = bsType.createPerspective();

                    switch (global.bsLevel) {
                        case ('perspective'):
                            global.bsLevel = undefined;
                            break;
                        case ('goal'):
                            global.bsLevel = 'perspective';
                            break;
                        case ('measure'):
                            global.bsLevel = 'goal';
                            break;
                        default: return;
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
                        if (global.bsLevel == undefined) {
                            bsItem = bsType.createPerspective(currentPosition(event));
                            global.perspectiveArray.push(bsItem);
                        }
                        break;
                    case ('goal'):
                        if (global.bsLevel == 'perspective') {
                            bsItem = bsType.createGoal(currentPosition(event));
                            bsItem.bsParent = global.bsParent;
                            bsItem.bsParent.addChildObject(bsItem);
                        }
                        break;
                    case ('measure'):
                        if (global.bsLevel == 'goal') {
                            bsItem = bsType.createMeasure(currentPosition(event));
                            bsItem.bsParent = global.bsParent;
                            bsItem.bsParent.addChildObject(bsItem);
                        }
                        break;
                    default: return;
                }

                if (bsItem != undefined) {
                    canvasObject.create(bsItem);
                    drawingPane.addBSItem(bsItem);
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
        page.addEventListener("mousemove", pageEvents.mousemove, false);
        page.addEventListener("dragover", pageEvents.mousedragover, false);
        page.addEventListener("drop", pageEvents.mousedrop, false);

        viewParentImage.addEventListener("mousedown", pageEvents.mousedown, false);
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
        viewItem: viewItem
    };
}());
