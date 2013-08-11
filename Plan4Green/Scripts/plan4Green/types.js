/*-------------------------------------------------------
TYPE DEFINITIONS
-------------------------------------------------------*/
// representation of a point on the client.
function Point(xPosition, yPosition)
{
    this.x = xPosition;
    this.y = yPosition;
}

// bs perspective object.
function Perspective(name, description, xPosition, yPosition)
{
    this.name = name;
    this.description = description;

    this.pos = new Point(xPosition, yPosition);
}

// bs goal object.
function Goal(name, dueDate, description, target, xPosition, yPosition)
{
    this.name = name;
    this.dueDate = dueDate;
    this.description = description;
    this.target = target;

    this.pos = new Point(xPosition, yPosition);
}

// bs measure object.
function Measure(name, dueDate, description, target, xPosition, yPosition)
{
    this.name = name;
    this.dueDate = dueDate;
    this.description = description;
    this.target = target;

    this.pos = new Point(xPosition, yPosition);
}