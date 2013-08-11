// Variables used while building app.
var isDebugging = true;
var position = document.getElementById("position");
var count = 0;

var classSize = 100;
/*-----------------------------------------------------------------
GLOBAL VARIABLES
-------------------------------------------------------------------*/

// page upon which stuff will be drawn.
var page;

// represents whether or not the app is dragging.
var isDragging;

// array of existing BS objects.
var bsObjects;

// current level of the page.
var currentLevel;

/*---------------------------------------------------------------------
DOM EVENTS
----------------------------------------------------------------------*/
function initialize()
{
    page = document.getElementById('drawing-page');
    
    isDragging = false;

    // clear the starting array.
    bsObjects = new Array();

    // add mouse event listeners to page
    page.addEventListener("mousedown", mousepressed, false);
    page.addEventListener("mouseup", mousereleased, false);
    page.addEventListener("mousemove", mousedragged, false);
    page.addEventListener("mouseout", mousecancelled, false);
}

// mousedown event handler
function mousepressed(event)
{
    new Perspective('financial', null, 200, 200);
    drawPerspective();
    getPosition(event);
}

// mouseup event handler
function mousereleased(event)
{
}

// mousemove event handler
function mousedragged(event)
{
    if (isDebugging)
    {
        var pos = getPosition(event);
        position.innerHTML = "(x: " + pos.x + " | y: " + pos.y + ")";
    }
}

// mouseout event handler
function mousecancelled(event)
{
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
    canvas.setAttribute('width', width + 20);
    canvas.setAttribute('height', height + 20);

    return canvas;
}

// create the parent div with inner canvas'.
function createDiv(xPosition, yPosition)
{
    // create the outer wrapper div.
    div = document.createElement('div');
    div.setAttribute('id', '-outer-wrapper');
    div.className = 'bsobject';

    // create the inner canvas with dummy id
    var canvas = createCanvas('bsObject' + count, classSize, classSize)
    count++;

    // set the div to the mouse click 
    div.style.left = xPosition + 'px';
    div.style.top = yPosition + 'px';

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
    var context = canvas.getContext('2d');
    refreshCanvas;
    
    context.strokeStyle = "#000000";
    context.strokeRect(pos.x, pos.y, classSize, classSize);
    context.fillStyle = "#ffffff";
    context.fillRect(pos.x, pos.y, classSize, classSize)

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
    function refreshCanvas(canvas)
    {
        // clear the old stuff off the canvas.
        context.clearRect(0, 0, canvas.scrollWidth, canvas.scrollHeight);

        // draw shapes as they exist on the screen.   
    }

    /*------------------------------------------------------------------------
    Other methods
    -------------------------------------------------------------------------*/
    // gets the position of a mouse event on the screen.
    function getPosition(event)
    {
        // position on the screen.  
        var pos = new Point(event.pageX, event.pageY);

        pos.x -= page.offsetLeft;
        pos.y -= page.offsetTop;

        return pos;
    }

    // Returns the current level of the app.
    function getCurrentLevel(name, type)
    {
        if (typeof type == null)
        {
            return "All Perspectives";
        }
        else
        {
            return typeof type + ": " + name;
        }
    }
