var canvasObject = (function () {
    var
    /*------------------------------------------------------------
    DRAWING METHODS
    --------------------------------------------------------------*/
        // redraw the canvas whenever something get's done.
    refreshCanvas = function () {
        // clear the old stuff off the canvas.
        context.clearRect(0, 0, canvas.scrollWidth, canvas.scrollHeight);
    },

    // create the parent div with inner canvas'.
    createDiv = function (divItem) {
        var

        // flag indicates whether an object is busy dragging
        isDragging,
        // flag indicates whether an object has been dragged
        hasDragged,

        // create the canvas on which the image will be drawn
        createCanvas = function () {
            var canvas = document.createElement('canvas');

            // set the canvas attribute tags
            canvas.setAttribute('id', divItem.name + "" + main.count + "-canvas");
            canvas.setAttribute('width', (divItem.width + (divItem.width * 5 / 100)));
            canvas.setAttribute('height', (divItem.height + (divItem.height * 5 / 100)));
            // get the canvas' context
            context = canvas.getContext('2d');

            return canvas;
        };

        // canvas div mouse events
        var canvasEvents = (function () {
            // canvas mouseover event handler
            mouseover = function (event) {
            },

            // canvas mousedown event handler
            mousedown = function (event) {
                isDragging = true;
                hasDragged = false;
                div.style.zIndex = '10';
                // change level when clicked.

            },

            // canvas mouseup event handler
            mouseup = function (event) {
                console.log(event.target);
                isDragging = false;
                if (hasDragged == false) {
                }
                hasDragged = false;
                div.style.zIndex = '3';

                divItem.currentPosition = main.currentPosition(event);
            },

            // canvas mousedrag event handler
            mousedrag = function (event) {
                if (isDragging) {
                    hasDragged = true;

                    // get the current mouse position
                    var pos = main.currentPosition(event);

                    if ((pos.x - divItem.centerX + main.page.offsetLeft) > main.page.offsetLeft
                        && (pos.x + divItem.centerX + 10) < main.page.offsetWidth) {
                        // move the perspective by middle
                        div.style.left = (pos.x - divItem.centerX) + 'px';
                    }

                    if ((pos.y - 10) > main.page.offsetTop
                        && (pos.y + divItem.centerY + 10) < main.page.offsetHeight) {
                        // move the perspective by middle
                        div.style.top = (pos.y - divItem.centerY) + 'px';
                    }
                }
            },

            // canvas mouseout event handler
            mouseout = function (event) {
                isDragging = false;
                if (hasDragged == false) {

                }
                hasDragged = false;
            }

            return {
                mouseover: mouseover,
                mousedown: mousedown,
                mouseup: mouseup,
                mousedrag: mousedrag,
                mouseout: mouseout
            }
        }());

        // outer wrapper div.
        div = document.createElement('div');
        div.setAttribute('id', divItem.name + '' + main.count + '-outer-wrapper');
        div.className = 'canvasObject';

        // inner canvas with id
        canvas = createCanvas()
        main.count++;

        // set the div to the mouse click 
        div.style.left = divItem.currentPosition.x + 'px';
        div.style.top = divItem.currentPosition.y + 'px';

        // set event listeners
        div.addEventListener("mouseover", canvasEvents.mouseover, false);
        div.addEventListener("mousedown", canvasEvents.mousedown, false);
        div.addEventListener("mouseup", canvasEvents.mouseup, false);
        div.addEventListener("mousemove", canvasEvents.mousedrag, false);
        div.addEventListener("mouseout", canvasEvents.mouseout, false);

        // append inner canvas to outer div
        div.appendChild(canvas);

        return div;
    },

    // draw a perspective BS Object
    drawPerspective = function (perspective) {
        var
        pos = perspective.currentPosition;
        div = createDiv(perspective);

        var
        // get the canvas context and draw the perspective outline
        drawOutline = function (centerX, centerY, width, height, lineWidth, fill) {
            context.beginPath();

            context.moveTo(centerX, centerY - height / 2);

            context.bezierCurveTo(
              centerX + width / 2, centerY - height / 2,
              centerX + width / 2, centerY + height / 2,
              centerX, centerY + height / 2);

            context.bezierCurveTo(
              centerX - width / 2, centerY + height / 2,
              centerX - width / 2, centerY - height / 2,
              centerX, centerY - height / 2);

            context.strokeStyle = "#404040"
            context.lineWidth = lineWidth;
            context.fillStyle = fill;
            context.fill();
            context.stroke();
            context.closePath();
        };

        drawOutline((perspective.centerX + (perspective.centerX * 5 / 100)),
            (perspective.centerY + (perspective.height * 3 / 100)),
            (perspective.width + (perspective.width * 35 / 100)),
            perspective.height, 2, "#ffffff");

        drawOutline((perspective.width - (perspective.width * 15 / 100)),
            (perspective.centerY + (perspective.height * 2 / 100)), 100, 70, 1, "#ff0000");

        // heading text div
        var heading = document.createElement('h1');
        heading.innerHTML = perspective.name;

        // description
        var description = document.createElement('p');
        description.innerHTML = perspective.description;

        div.appendChild(heading);
        div.appendChild(description);

        // place the div on the drawing page
        main.page.appendChild(div);
    },

    // draw a goal BS Object
    drawGoal = function (goal) {
        var
        pos = goal.currentPosition;
        div = createDiv(goal);

        var
        //  draw the goal outline
        drawOutline = function (centerX, centerY, width, height, lineWidth, fill) {
            context.beginPath();

            context.moveTo((width - width * 95 /100), centerY);
            context.lineTo((width - width * 75 / 100), (height - height * 95 / 100));
            context.lineTo((width - width * 20 / 100), (height - height * 95 / 100));
            context.lineTo((width - width * 1 / 100), centerY);
            context.lineTo((width - width * 20 / 100), (height - height * 2 / 100));
            context.lineTo((width - width * 75 / 100), (height - height * 2 / 100));
            context.closePath();

            context.strokeStyle = "#404040"
            context.lineWidth = lineWidth;
            context.fillStyle = fill;
            context.fill();
            context.stroke();

        };
        drawOutline(goal.centerX, goal.centerY, goal.width, goal.height, 2, "#ffffff");

        // heading text div
        var heading = document.createElement('h1');
        heading.innerHTML = goal.name;

        // description
        var description = document.createElement('p');
        description.innerHTML = goal.description;

        div.appendChild(heading);
        div.appendChild(description);

        // place the div on the drawing page
        main.page.appendChild(div);
    },

    // draw a measure BS Object
    drawMeasure = function (measure) {
        var
        pos = measure.currentPosition;
        div = createDiv(measure);

        var
//  draw the goal outline
drawOutline = function (centerX, centerY, width, height, lineWidth, fill) {
    context.beginPath();

    context.moveTo(centerX, height - (height * 95 / 100));
    context.lineTo((width - (width * 98 /100)), height);
    context.lineTo((width - (width * 2 / 100)), height);
    context.closePath();

    context.strokeStyle = "#404040"
    context.lineWidth = lineWidth;
    context.fillStyle = fill;
    context.fill();
    context.stroke();
};

        // heading text div
        var heading = document.createElement('h1');
        heading.innerHTML = measure.name;

        // description
        var description = document.createElement('p');
        description.innerHTML = measure.description;

        div.appendChild(heading);
        div.appendChild(description);

        drawOutline(measure.centerX, measure.centerY, measure.width, measure.height, 2, "#ffffff");

        

        // place the div on the drawing page
        main.page.appendChild(div);
    },

    /*-----------------------------------------------------------------
    CONSTRUCTION METHODS
    -------------------------------------------------------------------*/
    // constructor
    create = function (bsItem) {
        drawObject = function (bsItem) {
            // render the object according to the type.
            if (bsItem.name == 'Perspective') {
                drawPerspective(bsItem);
            }
            else if (bsItem.name == 'Goal') {
                drawGoal(bsItem);
            }
            else {
                drawMeasure(bsItem);
            }
        }
        drawObject(bsItem);
    };

    // expose members
    return {
        create: create,
    };
}());