var ajax = (function () {
    // get data from the database using ajax
    ajaxGet = function (url, success) {
        $.ajax({
            cache: false,
            type: "POST",
            url: url,
            data: JSON.stringify(url),
            dataType: "json",
            async: true,
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
                OldReference: perspective.oldRef,
                PerspectiveName: perspective.name,
                Description: perspective.description,
                OrganisationName: perspective.organisationName,

                xPosition: perspective.currentPosition.x,
                yPosition: perspective.currentPosition.y,
            }),
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            success: function (newItem) {
                console.log(newItem);
            },
            error: function () {
                console.log('an error has occured');
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
                OldReference: goal.oldRef,
                GoalName: goal.name,
                Description: goal.description,

                StartDate: goal.startDate,
                DueDate: goal.dueDate,

                xPosition: goal.currentPosition.x,
                yPosition: goal.currentPosition.y,

                ParentName: goal.bsParent.name,
                OrganisationName: goal.organisationName,
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
                OldReference: measure.oldRef,
                MeasureName: measure.name,
                Description: measure.description,
                OrganisationName: measure.organisationName,
                
                StartDate: measure.startDate,
                DueDate: measure.dueDate,

                xPosition: measure.currentPosition.x,
                yPosition: measure.currentPosition.y,
                targetValue: measure.targetValue,

                ParentName: measure.bsParent.name,
                GrandparentName: measure.bsParent.bsParent.name,

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

    // add or update completion ratio data to the database using ajax
    ajaxCompletionRatio = function (url, measure) {
        $.ajax({
            cache: false,
            type: "POST",
            url: url,
            data: JSON.stringify({
                CompletionScoreTime: measure.completionTimes[completionTimes.length - 1],
                CurrentValue: measure.completionRatios[completionRatios.length - 1],
                ParentName: measure.bsParent.name,
                GrandparentName: measure.bsParent.bsParent.name
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