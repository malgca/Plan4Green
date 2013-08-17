﻿var canvasObject = (function () {
    var
    /*-----------------------------------------------------------------
    BUILDING VARIABLES
    -------------------------------------------------------------------*/
    // dummy count and object size
     globalId,
        classSize = 100,

    /*-----------------------------------------------------------------
    SCRIPT VARIABLES
    -------------------------------------------------------------------*/
    // references to the children of the bs object represented by this canvasObject
    children = new Array(),
    // parent of the bs object represented by this canvasObject
    parent = null,

    /*------------------------------------------------------------
    DRAWING METHODS
    --------------------------------------------------------------*/
    // create the parent div with inner canvas'.
    createDiv = function (xPosition, yPosition) {
        var

        // flag indicates whether an object is busy dragging
        isDragging,
        // flag indicates whether an object has been dragged
        hasDragged,

        // create the canvas on which the image will be drawn
        createCanvas = function (name, width, height) {
            var canvas = document.createElement('canvas');

            // set the canvas attribute tags
            canvas.setAttribute('id', name + "-canvas");
            canvas.setAttribute('width', width + 10);
            canvas.setAttribute('height', height + 10);

            // get the canvas' context
            context = canvas.getContext('2d');

            return canvas;
        },

        // mouseover event handler
        mouseover = function (event) {
        },

        // mousedown event handler
        mousedown = function (event) {
            isDragging = true;
            hasDragged = false;
            div.style.zIndex = '10';

            // change level when clicked.
        },

        // mouseup event handler
        mouseup = function (event) {
            isDragging = false;
            hasDragged = false;
            div.style.zIndex = '3';
        },

        // mousedrag event handler
        mousedrag = function (event) {
            if (isDragging) {
                hasDragged = true;

                var pos = currentPosition(event);

                // make sure to move only this div
                
                // move the perspective by middle
                div.style.left = (pos.x - classSize / 2) + 'px';
                div.style.top = (pos.y - classSize / 2) + 'px';
            }
        },

        // mouseout event handler
        mouseout = function (event) {
            isDragging = false;
            if (hasDragged == false) {

            }
        },

        // outer wrapper div.
        div = document.createElement('div');
        div.setAttribute('id', 'canvasObject' + count + '-outer-wrapper');
        div.className = 'canvasObject';

        // inner canvas with id
        canvas = createCanvas('canvasObject' + count, classSize, classSize)
        count++;

        // set the div to the mouse click 
        div.style.left = xPosition + 'px';
        div.style.top = yPosition + 'px';

        // set event listeners
        div.addEventListener("mouseover", mouseover, false);
        div.addEventListener("mousedown", mousedown, false);
        div.addEventListener("mouseup", mouseup, false);
        div.addEventListener("mousemove", mousedrag, false);
        div.addEventListener("mouseout", mouseout, false);

        // append inner canvas to outer div
        div.appendChild(canvas);

        return div;
    },

    // redraw the canvas whenever something get's done.
    refreshCanvas = function () {
        // clear the old stuff off the canvas.
        context.clearRect(0, 0, canvas.scrollWidth, canvas.scrollHeight);
    },

    // draw a perspective BS Object
    drawPerspective = function (perspective) {
        var pos = currentPosition(event);
        var div = createDiv(pos.x, pos.y);

        // get the canvas context and draw the perspective outline
        context.strokeStyle = "#000000";
        context.lineWidth = 4;
        context.strokeRect(5, 5, classSize, classSize);
        context.fillStyle = "#ffffff";
        context.fillRect(5, 5, classSize, classSize)

        // place the div on the drawing page
        page.appendChild(div);
    },

    // draw a goal BS Object
    drawGoal = function (goal) {
        // draw sextagon wrapper
    },

    // draw a measure BS Object
    drawMeasure = function (measure) {
        // draw triangle wrapper
    },

    // draw the stoplight indicators for BS Objects.
    drawIndicator = function (type, name) {
        var type = typeof (bsObject);
        if (typeof type == "Perspective") {
            alert(type);
        }
        else {
        }
    },

    /*-----------------------------------------------------------------
    CONSTRUCTION METHODS
    -------------------------------------------------------------------*/
    // constructor
    create = function (objectType) {
        drawObject = function (objectType) {
            // render the object according to the type.
            if (objectType == 'Perspective') {
                drawPerspective(null);
            }
            else if (objectType == 'Goal') {
                drawGoal(null);
            }
            else {
                drawMeasure(null);
            }
        }

        drawObject(objectType);
    };

    // expose methods
    return { create: create, children: children, parent: parent };
}());