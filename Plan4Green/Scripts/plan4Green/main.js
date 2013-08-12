/*-----------------------------------------------------------------
BUILDING VARIABLES
-------------------------------------------------------------------*/
// flag set while creatings site.
var isUnderConstruction = true;

// elements to show building information
var position = document.getElementById("position");
var status = document.getElementById("status");

// dummy count and object size
var count = 0;
var classSize = 100;

/*-----------------------------------------------------------------
SCRIPT VARIABLES
-------------------------------------------------------------------*/

// page upon which stuff will be drawn.
var page;

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

    createBSObject('Perspective');
    createBSObject('Perspective');
}

function createBSObject(type)
{
    count++;
    new bsobject(type, count, classSize);
}
// mousedown event handler
function mousepressed(event)
{
}

// mouseup event handler
function mousereleased(event)
{
}

// mousemove event handler
function mousedragged(event)
{
    if (isUnderConstruction)
    {
        var pos = getPosition(event);
        position.innerHTML = "(x: " + pos.x + " | y: " + pos.y + ")";
        
    }
}

// mouseout event handler
function mousecancelled(event)
{
}

/*------------------------------------------------------------------------
PAGE METHODS
-------------------------------------------------------------------------*/
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
