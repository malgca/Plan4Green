var base = (function () {
    // bs Object template
    function BSObject(name, description, currentValue, targetValue, startDate, endDate, currentPosition) {
        // bsObjects name.
        this.name = name;
        // bsObjects description.
        this.description = description;
        // bsObjects current value.
        this.currentValue = currentValue;
        // bsObjects target value.
        this.targetValue = targetValue;
        // date at which bsObject starts
        this.startDate = startDate;
        // date at which bsObject is due.
        this.endDate = endDate;

        // the current co-ordinates of the bs object
        this.currentPos = currentPosition;

        // children belonging to the bsObject.
        this.children = new Array();
        // parent of the bsObject
        this.parent = null;

        // add a child object to this bsObject's array.
        this.addChildObject = function (childObject) {
            this.children.push(childObject);
        };

        // remove a child object from this bsObject's array.
        this.removeChildObject = function (childObject) {
            var childIndex = this.children.indexOf(childObject);
            this.children.splice(childIndex, 1);
        };
    }

    // expose BSObject
    return { BSObject: BSObject }
}());

// representation of a point on the client.
function Point(xPosition, yPosition) {
    // x co-ordinate at which to place object.
    this.x = xPosition;
    // y co-ordinate at which to place object
    this.y = yPosition;
}

// bs perspective object.
function Perspective(name, description, currentPosition) {
    // inherit the BSObject
    Perspective.prototype = new base.BSObject();

    // the name of the current perspective.
    this.name = name;
    // the description assigned to this perspective
    this.description = description;
    // bsObjects current value.
    this.currentValue = null;
    // bsObjects target value.
    this.targetValue = null;
    // date at which bsObject starts
    this.startDate = startDate;
    // date at which bsObject is due.
    this.endDate = endDate;

    // the current position on the screen.
    this.currentPos = currentPosition;
}

// bs goal object.
function Goal(name, description, currentValue, targetValue, startDate, endDate, currentPosition) {
    // inherit the BSObject
    Goal.prototype = new base.BSObject();

    // the name of the current perspective.
    this.name = name;
    // the description assigned to this perspective
    this.description = description;
    // bsObjects current value.
    this.currentValue = currentValue;
    // bsObjects target value.
    this.targetValue = targetValue;
    // date at which bsObject starts
    this.startDate = startDate;
    // date at which bsObject is due.
    this.endDate = endDate;

    // the current position on the screen.
    this.currentPos = currentPosition;
}

// bs measure object.
function Measure(name, description, currentValue, targetValue, startDate, endDate, currentPosition) {
    // inherit the BSObject
    Measure.prototype = new base.BSObject();

    // the name of the current perspective.
    this.name = name;
    // the description assigned to this perspective
    this.description = description;
    // bsObjects current value.
    this.currentValue = null;
    // bsObjects target value.
    this.targetValue = null;
    // date at which bsObject starts
    this.startDate = startDate;
    // date at which bsObject is due.
    this.endDate = endDate;

    // the current position on the screen.
    this.currentPos = currentPosition;
}