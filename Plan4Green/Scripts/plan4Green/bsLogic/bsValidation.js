var bsValidation = (function () {
    var
        // validates the target/current value to ensure it is within the allowed parameters. Returns target/current value if acceptable, returns maximum value if too high and minimum value (0) if too low
        validValue = function (value, maxValue) {
            if (value < 0) {
                return 0;
            }

            if (value > maxValue) {
                return maxValue;
            }

            return value;
        },

        // validates date input to ensure it is acceptable
        validDate = function (startDate, endDate) {
            // start date may not be after end date
            if (startDate > endDate) {
                return false;
            } else if (endDate < startDate) { // end date may not be before start date
                return false;
            }
            return true;
        },

        // make sure the name of an object is valid before it is named. Returns true if valid, else returns false.
        validName = function (bsItem, newName) {
            if (bsItem.type == 'perspective') {
                // get the global perspectives and make sure none of them have the name this one is using
                for (var i = 0; i < global.perspectiveArray.length; i++) {
                    if (global.perspectiveArray[i].name === newName) {
                        return false;
                    }
                }
            } else {
                for (var i = 0; i < bsItem.bsParent.children.length; i++) {
                    if (bsItem.bsParent.children[i].name === newName) {
                        return false;
                    }
                }
            }

            return true;
        }
    return {
        validValue: validValue,
        validDate: validDate,
        validName: validName
    }
}())