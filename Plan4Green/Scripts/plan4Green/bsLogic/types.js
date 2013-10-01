// representation of a point on the client.
function Point(xPosition, yPosition) {
    // x co-ordinate at which to place object.
    this.x = xPosition;
    // y co-ordinate at which to place object
    this.y = yPosition;
}

var bsType = (function () {
    var
        defaultDescription = "Please add a description here",

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
        // flag indicating whether or not a bs object is currently editting
        this.isEditing = true;

        // children belonging to the bsObject.
        this.children = new Array();
        // parent of the bsObject
        this.bsParent = undefined;
        // notify if bsObject is currently in strategy map view.
        this.mapView = parent;
        // notify if bsObject is current enabled
        this.isEnabled = true;
        // notify if bsObject is currently being viewed
        this.isActive = false;
        // the old reference by which this object was refered, used when changing names
        this.oldRef = this.name;

        // add a child object to this bsObject's array.
        this.addChildObject = function (childObject) {
            // make sure the object isn't in there already
            for (var i = 0; i < this.children.length; i++) {
                if (this.children[i].name === childObject.name) {
                    alert('Please rename and save ' + childObject.name + ' before attempting to add a new ' + childObject.type + ' to the canvas.');
                    return false;
                }
            }
            this.children.push(childObject);
            return true;
        };

        // change the name of the object, keeping the old ref intact
        this.changeName = function (newName) {
            this.oldRef = this.name;
            this.name = newName;
        }

        // set an item to be enabled for editing
        this.enableItem = function () {
            this.isEditing = true;
            this.isEnabled = true;
        }

        // set an item to be disabled for editing
        this.disableItem = function () {
            console.log('disabling ' + name);
            this.isEditing = false;
            this.isEnabled = false;
        }
    },

    // bs perspective object.
    Perspective = function () {
        // store the name of the organisation this perspective belongs to
        this.organisationName = '';
        // set the type to perspective by default
        this.type = "perspective";

        this.currentValue = function () {
            var currentTemp = Number(0);

            for (var i = 0; i < this.children.length; i++) {
                currentTemp += Number(this.children[i].currentValue());
            }

            return currentTemp;
        }

        this.targetValue = function () {
            var targetTemp = Number(0);

            for (var i = 0; i < this.children.length; i++) {
                targetTemp += Number(this.children[i].targetValue());
            }

            return targetTemp;
        }

        this.completionRatio = function () {
            return ((this.currentValue() / this.targetValue()) * 100);
        }

        this.allChildrenDisabled = function () {
            var childrenDisabled = true;

            if (this.children.length > 0) {
                for (var i = 0; i < this.children.length; i++) {
                    if (this.children[i].isEnabled) {
                        childrenDisabled = false;
                    }
                }
            }

            return childrenDisabled;
        }
    },

    // bs goal object.
    Goal = function () {
        // set the type to goal by default
        this.type = "goal";

        // goals target value's are calculated as a sum of all child measure target values
        this.targetValue = function () {
            var targetTemp = Number(0);

            for (var i = 0; i < this.children.length; i++) {
                targetTemp += Number(this.children[i].targetValue);
            }

            return targetTemp;
        }

        // goals current value's are calculated as a sum of all measure current values
        this.currentValue = function () {
            var currentTemp = Number(0);

            for (var i = 0; i < this.children.length; i++) {
                currentTemp += Number(this.children[i].currentValue);
            }

            return currentTemp;
        }

        // find if all children of this goal have been disabled
        this.allChildrenDisabled = function () {
            var childrenDisabled = true;

            if (this.children.length > 0) {
                for (var i = 0; i < this.children.length; i++) {
                    if (this.children[i].isEnabled) {
                        childrenDisabled = false;
                    }
                }
            }

            return childrenDisabled;
        }

        this.completionRatios = [];

        // get the completion ratio of the goal, calculated as current values over target value
        this.calculateCompletionRatio = function () {
            var ratio = Math.round(((this.currentValue() / this.targetValue()) * 100));
            this.completionRatios.push(ratio);
        }
    },

    // bs measure object.
    Measure = function () {
        // set the type to perspective by default
        this.type = "measure";

        this.completionRatios = [];
        this.completionTimes = [];

        // get the completion ratio of the goal, calculated as current values over target value
        this.calculateCompletionRatio = function () {
            var ratio = Math.round(((this.currentValue / this.targetValue) * 100));
            this.completionRatios.push(ratio);
            var timeString = new Date().toLocaleDateString() + ' - ' + new Date().toLocaleTimeString();
            this.completionTimes.push(timeString);
        }
    },

    // create a perspective object
    createPerspective = function (position) {
        // inherit the BSObject
        Perspective.prototype = new BSObject("Perspective Name", defaultDescription, null, null, null, null, position);

        // create a new perspective object.
        return new Perspective();
    },

    // create a goal object
    createGoal = function (position) {
        // inherit the BSObject
        Goal.prototype = new BSObject("Goal Name", defaultDescription, 0, 1, null, null, position);

        // create a new goal object.
        return new Goal();
    },

    // create a measure object
    createMeasure = function (position) {
        // inherit the BSObject
        Measure.prototype = new BSObject("Measure Name", defaultDescription, 0, 1, null, null, position);

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