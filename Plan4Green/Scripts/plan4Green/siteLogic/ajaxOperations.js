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

    // add data to the database using ajax
    ajaxAdd = function (url, item) {
        $.ajax({
            cache: false,
            type: "POST",
            url: url,
            data: JSON.stringify(item),
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
        });
    }

    // update data in the database using ajax
    ajaxUpdate = function (url, item) {
    }

    return {
        get: ajaxGet,
        add: ajaxAdd,
        update: ajaxUpdate
    }

}());