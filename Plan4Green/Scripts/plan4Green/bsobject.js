/*-----------------------------------------------------------------
BUILDING VARIABLES
-------------------------------------------------------------------*/
// dummy count and object size
var globalId;
var classSize = 100;

/*-----------------------------------------------------------------
SCRIPT VARIABLES
-------------------------------------------------------------------*/
// flags
var isDragging;
var hasDragged;
var isMouseOver;
var isCaptured;

// object div, canvas and the canvas' resident context.
var div, canvas, context;

// type of object the div is housing
var objectType;

/*-----------------------------------------------------------------
CONSTRUCTION METHODS
-------------------------------------------------------------------*/
// constructor
function bsobject(object)
{
    objectType = object;
    drawObject(objectType);
}

// draws appropriate object
function drawObject(object)
{
    // render the object according to the type.
    if (object == 'Perspective')
    {
        drawPerspective(null);
    }
    else if (object == 'Goal')
    {
        drawGoal(null);
    }
    else
    {
        drawMeasure(null);
    }
}

/*---------------------------------------------------------------------
OBJECT EVENTS
----------------------------------------------------------------------*/
// mouseover event handler
function mouseover(event)
{   
}

// mousedown event handler
function mousedown(event)
{
    div.style.zindex = "9999";
    isDragging = true;
    hasDragged = false;
}

// mouseup event handler
function mouseup(event)
{
    isDragging = false;

    if (!hasDragged && objectType)
    {

    }
    hasDragged = false;
}

// mousedrag event handler
function mousedrag(event)
{
    
    if (isDragging)
    {
        hasDragged = true;

        this.pos = getPosition(event);

        // make sure to move only this div
        
        // move the perspective by middle
        div.style.left = (this.pos.x - classSize / 2) + 'px';
        div.style.top = (this.pos.y - classSize / 2) + 'px';
    }
}

// mouseout event handler
function mouseout(event)
{
    isDragging = false;
    hasDragged = false;
}
/*------------------------------------------------------------
DRAWING METHODS
--------------------------------------------------------------*/
// create the canvas upon which bs objects will be drawn.
function createCanvas(name, width, height)
{
    // get drawing canvas
    canvas = document.createElement('canvas');

    // set the canvas attribute tags
    canvas.setAttribute('id', name + "-canvas");
    canvas.setAttribute('width', width + 10);
    canvas.setAttribute('height', height + 10);

    return canvas;
}

// create the parent div with inner canvas'.
function createDiv(xPosition, yPosition)
{
    // create the outer wrapper div.
    div = document.createElement('div');
    div.setAttribute('id', 'bsobject' + count + '-outer-wrapper');
    div.className = 'bsobject';
    
    // create the inner canvas with dummy id
    canvas = createCanvas('bsObject' + count, classSize, classSize)
    count++;
    
    // set the div to the mouse click 
    div.style.left = xPosition + 'px';
    div.style.top = yPosition + 'px';

    // set bsobject methods
    div.addEventListener("mouseover", mouseover, false);
    div.addEventListener("mousedown", mousedown, false);
    div.addEventListener("mouseup", mouseup, false);
    div.addEventListener("mousemove", mousedrag, false);
    div.addEventListener("mouseout", mouseout, false);

    // append inner canvas to outer div
    div.appendChild(canvas);
    return div;
}

// draw a perspective BS Object
function drawPerspective(perspective)
{
    var pos = getPosition(event);

    div = createDiv(pos.x, pos.y);
    // get the canvas context and draw the perspective outline
    context = canvas.getContext('2d');
    refreshCanvas;
    
    context.strokeStyle = "#000000";
    context.lineWidth = 4;
    context.strokeRect(5, 5, classSize, classSize);
    context.fillStyle = "#ffffff";
    context.fillRect(5, 5, classSize, classSize)

    // place the div on the drawing page
    page.appendChild(div);
}

// draw a goal BS Object
function drawGoal(goal)
{
    // draw sextagon wrapper

}

// draw a measure BS Object
function drawMeasure(measure)
{
    // draw triangle wrapper
}

// draw the stoplight indicators for BS Objects.
function drawIndicator(type, name)
{
    var type = typeof (bsObject);
    if (typeof type == "Perspective")
    {
        alert(type);
    }
    else
    {
    }
}

// redraw the canvas whenever something get's done.
function refreshCanvas()
{
    // clear the old stuff off the canvas.
    context.clearRect(0, 0, canvas.scrollWidth, canvas.scrollHeight);

    // draw shapes as they exist on the screen.   
}
