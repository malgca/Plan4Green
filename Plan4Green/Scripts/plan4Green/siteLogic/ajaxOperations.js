var ajax = (function () {
    // get data from the database using ajax
    ajaxGet = function (url, success) {
        $.ajax({
            cache: false,
            type: "POST",
            url: url,
            data: JSON.stringify(url),
            dataType: "json",
            success: success
        });
    }

    // add or update perspective data to the database using ajax
    ajaxPerspective = function (url, perspective) {
        $.ajax({
            cache: false,
            type: "POST",
            url: url,
            data: JSON.stringify({
                PerspectiveName: perspective.name,
                Description: perspective.description,
                OrganisationName: perspective.organisationName,

                xPosition: perspective.currentPosition.x,
                yPosition: perspective.currentPosition.y,

                Children: perspective.children
            }),
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (newItem) {
                console.log(newItem);
            }
        });
    }

    // add or update goal data to the database using ajax
    ajaxGoal = function (url, goal) {
        $.ajax({
            cache: false,
            type: "POST",
            url: url,
            data: JSON.stringify({
                GoalName: goal.name,
                Description: goal.description,

                StartDate: goal.startDate,
                DueDate: goal.dueDate,

                xPosition: goal.currentPosition.x,
                yPosition: goal.currentPosition.y,

                Parent: goal.bsParent,
                OrganisationName: goal.organisationName,

                Children: goal.children
            }),
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (newItem) {
                console.log(newItem);
            }
        });
    }

    // add or update measure data to the database using ajax
    ajaxMeasure = function (url, measure) {
        $.ajax({
            cache: false,
            type: "POST",
            url: url,
            data: JSON.stringify({
                MeasureName: measure.name,
                Description: measure.description,
                
                StartDate: measure.startDate,
                DueDate: measure.dueDate,

                xPosition: measure.currentPosition.x,
                yPosition: measure.currentPosition.y,

                Parent: measure.bsParent,

                CompletionRatios: measure.completionRatios,
                CompletionTimes: measure.completionTimes,
            }),
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (newItem) {
                console.log(newItem);
            }
        });
    }

    return {
        get: ajaxGet,

        perspective: ajaxPerspective,
        goal: ajaxGoal,
        measure: ajaxMeasure
    }

}());