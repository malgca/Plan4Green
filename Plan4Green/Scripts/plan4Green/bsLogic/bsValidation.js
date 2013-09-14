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
        }

    return {
        validValue: validValue,
        validDate: validDate
    }
}())