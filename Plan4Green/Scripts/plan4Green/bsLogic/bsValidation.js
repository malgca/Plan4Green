var bsValidation = (function () {
    var
        // validates the target/current value to ensure it is within the allowed parameters. Returns target/current value if acceptable, returns maximum value if too high and minimum value (0) if too low
        validValue = function (value, maxValue) {
            if (Number(value) < Number(0)) {
                return Number(0);
            }

            if (Number(value) > Number(maxValue)) {
                return Number(maxValue);
            }

            return Number(value);
        },

        // validates date input to ensure it is acceptable
        validDate = function (startDate, endDate) {
            // put dates into comparable format
            var start = new Date(Number(startDate.slice(0, 4)), (Number(startDate.slice(5, 7)) - 1), Number(startDate.slice(8, 10)));
            var end = new Date(Number(endDate.slice(0, 4)), (Number(endDate.slice(5, 7)) - 1), Number(endDate.slice(8, 10)));

            // start date may not be after end date
            if (start > end) {
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