/*------------------------------------------------------------------------
UTILITY METHODS
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