﻿// representation of a point on the client.
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
    BSObject = function (name, description, currentValue, targetValue, startDate, endDate, currentPosition, width, height) {
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
        this.currentPosition = currentPosition;

        // children belonging to the bsObject.
        this.children = new Array();
        // parent of the bsObject
        this.bsParent = null;
        // notify if bsObject is currently in strategy map view.
        this.mapView = parent;
        // the height and width dimensions of the current object
        this.width = width;
        this.height = height;

        // center of the object
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        // add a child object to this bsObject's array.
        this.addChildObject = function (childObject) {
            if (this.children.indexOf(childObject) > -1) {
                this.children.push(childObject);
            }
        };

        // remove a child object from this bsObject's array.
        this.removeChildObject = function (childObject) {
            var childIndex = this.children.indexOf(childObject);
            if (childIndex > -1) {
                this.children.splice(childIndex, 1);
            }
        };
    },

    // bs perspective object.
    Perspective = function (name, description, currentPosition) {
        // set the type to perspective by default
        this.type = "perspective";
    },
    
    // bs goal object.
    Goal = function (name, description, currentValue, targetValue, startDate, endDate, currentPosition) {
        // set the type to goal by default
        this.type = "goal";
    },

    // bs measure object.
    Measure = function (name, description, currentValue, targetValue, startDate, endDate, currentPosition) {
        // set the type to perspective by default
        this.type = "measure";
    },

    // create a perspective object
    createPerspective = function (position) {
        // inherit the BSObject
        Perspective.prototype = new BSObject('Perspective', defaultDescription, null, null, null, null, position, 400, 200);

        // create a new perspective object.
        return new Perspective();
    },

    // create a goal object
    createGoal = function (position) {
        // inherit the BSObject
        Goal.prototype = new BSObject('Goal', defaultDescription, 0, 1, null, null, position, 300, 200);

        // create a new goal object.
        return new Goal();
    },

    // create a measure object
    createMeasure = function (position) {
        // inherit the BSObject
        Measure.prototype = new BSObject('Measure', defaultDescription, 0, 1, null, null, position, 300, 300);

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