// representation of a point on the client.
function Point(xPosition, yPosition) {
    // x co-ordinate at which to place object.
    this.x = xPosition;
    // y co-ordinate at which to place object
    this.y = yPosition;
}

var bsType = (function () {
    var

        defaultDescription = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor...",

    // bs Object template
    BSObject = function (name, description, currentValue, targetValue, startDate, dueDate, currentPosition) {
        // bsObjects name.
        this.name = name;
        // bsObjects description.
        this.description = description;
        // bsObjects current value.
        this.currentValue = Number(currentValue);
        // bsObjects target value.
        this.targetValue = Number(targetValue);
        // date at which bsObject starts
        this.startDate = startDate;
        // date at which bsObject is due.
        this.dueDate = dueDate;

        // the current co-ordinates of the bs object
        this.currentPosition = currentPosition;

        // children belonging to the bsObject.
        this.children = new Array();
        // parent of the bsObject
        this.bsParent = undefined;
        // notify if bsObject is currently in strategy map view.
        this.mapView = parent;

        // add a child object to this bsObject's array.
        this.addChildObject = function (childObject) {
            // make sure the object isn't in there already
            if (this.children.indexOf(childObject) == -1) {
                this.children.push(childObject);
            }
        };

        // remove a child object from this bsObject's array.
        this.removeChildObject = function (childObject) {
            if (this.children.indexOf(childObject) == -1) {
                this.children.splice(childIndex, 1);
            }
        };
    },

    // bs perspective object.
    Perspective = function () {
        // set the type to perspective by default
        this.type = "perspective";

        this.currentValue = function () {
            var currentTemp = Number(0);

            for (var i = 0; i < this.children.length; i++) {
                currentTemp += Number(this.children[i].currentValue);
            }

            return currentTemp;
        }
    },
    
    // bs goal object.
    Goal = function () {
        // set the type to goal by default
        this.type = "goal";

        // goals current value's are calculated as a sum of all measure current values
        this.currentValue = function () {
            var currentTemp = Number(0);

            for (var i = 0; i < this.children.length; i++) {
                currentTemp += Number(this.children[i].currentValue);
            }

            return currentTemp;
        }

        // goals target value's are calculated as a sum of all measure target values
        this.targetValue = function () {
            var targetTemp = Number(0);

            for (var i = 0; i < this.children.length; i++) {
                targetTemp += Number(this.children[i].targetValue);
            }

            return targetTemp;
        }

        this.completionRatio = ((this.currentValue / this.targetValue) * 100);
    },

    // bs measure object.
    Measure = function () {
        // set the type to perspective by default
        this.type = "measure";

        this.completionRatio = ((this.currentValue / this.targetValue) * 100);
    },

    // create a perspective object
    createPerspective = function (position) {
        // inherit the BSObject
        Perspective.prototype = new BSObject("Perspective Name" + debug.count, defaultDescription, null, null, null, null, position);

        // create a new perspective object.
        return new Perspective();
    },

    // create a goal object
    createGoal = function (position) {
        // inherit the BSObject
        Goal.prototype = new BSObject("Goal Name" + debug.count, defaultDescription, 0, 1, null, null, position);

        // create a new goal object.
        return new Goal();
    },

    // create a measure object
    createMeasure = function (position) {
        // inherit the BSObject
        Measure.prototype = new BSObject("Measure Name" + debug.count, defaultDescription, 0, 1, null, null, position);

        // create a measure goal object.
        return new Measure();
    };

    // expose public members
    return {
        createPerspective: createPerspective,
        createGoal: createGoal,
        createMeasure: createMeasure
    };
}());