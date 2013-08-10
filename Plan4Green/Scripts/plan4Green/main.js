/*-----------------------------------------------------------------
GLOBAL VARIABLES
-------------------------------------------------------------------*/

var canvas, context

/*------------------------------------------------------------------
TYPE DEFINITIONS
-------------------------------------------------------------------*/

// representation of a point on the client.
function Point(xPosition, yPosition)
{
    this.x = xPosition;
    this.y= yPosition;
}

/*---------------------------------------------------------------------
DOM EVENTS
----------------------------------------------------------------------*/
function initialize()
{
    // get drawing canvas and assign corresponding context
    canvas = document.getElementById('drawing-canvas');
    context = canvas.getContext('2d');

    // add event listeners to canvas
    canvas.addEventListener("mousedown", getPosition, false);
}

// gets the position of a mouse event on the screen.
function getPosition(event)
{
    // position on the screen.  
    var pos = new Point(event.x, event.y);

    pos.x -= canvas.offsetLeft;
    pos.y -= canvas.offsetTop;
    return pos;
}

/*------------------------------------------------------------
DRAWING METHODS
--------------------------------------------------------------*/
// draw a perspective BS Object
function drawPerspective()
{
    var pos = getPosition(event);
    //draw oval wrapper
    context.fillStyle = "rgba(0, 0, 200, 1)";
    context.fillRect(pos.x, pos.y, 75, 70);
    alert("x: " + pos.x + " y: " + pos.y);
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

function drawIndicator(bsObject, name)
{
    var type = typeof (bsObject);
    alert(type);
}