var debug = {
    // flag set while creatings site.
    isUnderConstruction: true,

    // dummy count variable
    count: 0
},

global = {
    // current level viewed
    bsLevel: undefined,
    // global bs item reference
    bsParent: undefined,
    // array of existing BS perspectives.
    perspectiveArray: new Array(),
    // flag if busy viewing a graph
    isGraphing: false
},

main = (function () {
    var
    // the page on which stuff is drawn
    page = document.getElementById("drawing-page"),
    // the logout button
    viewParentImage = document.getElementById("viewParentImage"),
    // current position in BS views
    bsCurrentView = document.getElementById("current-view-text"),
    // background colors for perspectives, goals and measures
    backgroundColors = {
        all: '-webkit-linear-gradient(bottom, rgb(115,114,115) 27%, rgb(207,207,207) 100%)',
        perspective: '-webkit-linear-gradient(bottom, rgb(62,174,189) 27%, rgb(140,204,222) 100%)',
        goal: '-webkit-linear-gradient(bottom, rgb(145,0,0) 27%, rgb(242,109,109) 100%)'
    }

    // get the current position of the object in relation to the drawing page
    currentPosition = function (event) {
        // position on the screen.
        var pos = new Point(event.pageX, event.pageY);

        pos.x -= main.page.offsetLeft;
        pos.y -= main.page.offsetTop;

        return pos;
    },

    // clear all child elements from page
    clearPage = function () {
        while (page.childElementCount > 0) {
            page.removeChild(page.lastChild);
        }
    },

    // draw the parents or children of a bsItem
    viewItem = function (bsItem, viewParent) {
        // viewing parents
        if (viewParent) {
            // viewing goals
            if (bsItem.type == 'perspective') {
                clearPage();

                for (var i = 0; i < global.perspectiveArray.length; i++) {
                    canvasObject.create(global.perspectiveArray[i]);

                    for (var j = 0; j < global.perspectiveArray[i].children.length; j++) {
                        global.perspectiveArray[i].children[j].isActive = false;
                        drawingPane.redrawBSItems(global.perspectiveArray[i].children[j]);
                    }
                }

                bsItem.isActive = false;
                global.bsLevel = undefined;
                global.bsParent = undefined;
                drawingPane.redrawBSItems(bsItem);
                bsCurrentView.innerHTML = 'All Perspectives';
                page.style.backgroundImage = backgroundColors.all;
            }
            else if (bsItem.type == 'goal') { // viewing measures
                clearPage();

                for (var i = 0; i < bsItem.bsParent.children.length; i++) {
                    canvasObject.create(bsItem.bsParent.children[i]);
                }

                bsItem.isActive = false;
                drawingPane.redrawBSItems(bsItem);
                drawingPane.clearBSItems('measure');
                global.bsParent = bsItem.bsParent;
                global.bsLevel = bsItem.bsParent.type;
                bsCurrentView.innerHTML = bsItem.bsParent.name;
                page.style.backgroundImage = backgroundColors.perspective;
            }
            else if (bsItem.type == 'measure') {
                clearPage();

                for (var i = 0; i < bsItem.bsParent.children.length; i++) {
                    canvasObject.create(bsItem.bsParent.children[i]);
                }

                global.bsParent = bsItem.bsParent;
                global.bsLevel = bsItem.bsParent.type;
                bsCurrentView.innerHTML = bsItem.bsParent.name;
                page.style.backgroundImage = backgroundColors.goal;
            }
        }
        else { // viewing children
            clearPage();

            for (var i = 0; i < bsItem.children.length; i++) {
                canvasObject.create(bsItem.children[i]);
            }

            if (bsItem.type == 'perspective') {
                global.bsLevel = 'perspective';
                page.style.backgroundImage = backgroundColors.perspective;
            }
            else if (bsItem.type == 'goal') {
                global.bsLevel = 'goal';
                page.style.backgroundImage = backgroundColors.goal;
            }

            global.bsParent = bsItem;
            bsCurrentView.innerHTML = bsItem.name;

            if (bsItem.type != 'measure') {
                bsItem.isActive = true;
                drawingPane.redrawBSItems(bsItem);
            }
            else {
            }
        }
    },

    // initialize the bsPage
    init = function () {
        // populate the bsItems from the database
        var populateItems = function () {
            // get the perspectives
            ajax.get('/JSON/GetPerspectives', function (newItem) {
                while (newItem.length > 0) {
                    var firstIndex = newItem.indexOf('^', 0);
                    var secIndex = newItem.indexOf('^', firstIndex + 1);
                    var thirdIndex = newItem.indexOf('^', secIndex + 1);
                    var fourthIndex = newItem.indexOf('^', thirdIndex + 1);
                    var fifthIndex = newItem.indexOf('|', fourthIndex + 1);

                    var name = newItem.substring(0, firstIndex);
                    var description = newItem.substring(firstIndex + 1, secIndex);
                    var organisationName = newItem.substring(secIndex + 1, thirdIndex);
                    var x = newItem.substring(thirdIndex + 1, fourthIndex);
                    var y = newItem.substring(fourthIndex + 1, fifthIndex);
                    var perspective = bsType.createPerspective(new Point(x, y));

                    perspective.name = name;
                    perspective.description = description;
                    perspective.organisationName = organisationName;
                    perspective.isEditing = false;

                    newItem = newItem.substring(fifthIndex + 1, newItem.length)

                    global.perspectiveArray.push(perspective);
                }
            });

            ajax.get('/JSON/GetGoals', function (newItem) {
                while (newItem.length > 0) {
                    var firstIndex = newItem.indexOf('^', 0);
                    var secIndex = newItem.indexOf('^', firstIndex + 1);
                    var thirdIndex = newItem.indexOf('^', secIndex + 1);
                    var fourthIndex = newItem.indexOf('^', thirdIndex + 1);
                    var fifthIndex = newItem.indexOf('^', fourthIndex + 1);
                    var sixthIndex = newItem.indexOf('^', fifthIndex + 1);
                    var seventhIndex = newItem.indexOf('^', sixthIndex + 1);
                    var eigthIndex = newItem.indexOf('|', seventhIndex + 1);

                    var name = newItem.substring(0, firstIndex);
                    var description = newItem.substring(firstIndex + 1, secIndex);
                    var organisationName = newItem.substring(secIndex + 1, thirdIndex);
                    var x = newItem.substring(thirdIndex + 1, fourthIndex);
                    var y = newItem.substring(fourthIndex + 1, fifthIndex);
                    var startDate = newItem.substring(fifthIndex + 1, sixthIndex);
                    var dueDate = newItem.substring(sixthIndex + 1, seventhIndex);
                    var parentName = newItem.substring(seventhIndex + 1, eigthIndex);

                    var goal = bsType.createGoal(new Point(x, y));

                    goal.name = name;
                    goal.description = description;
                    goal.organisationName = organisationName;
                    goal.startDate = startDate;
                    goal.dueDate = dueDate;
                    goal.isEditing = false;

                    for (var i = 0; i < global.perspectiveArray.length; i++) {
                        if (global.perspectiveArray[i].name === parentName) {
                            goal.bsParent = global.perspectiveArray[i];
                            global.perspectiveArray[i].addChildObject(goal);
                            break;
                        }
                    }
                    newItem = newItem.substring(eigthIndex + 1, newItem.length)
                }
            });

            ajax.get('/JSON/GetMeasures', function (newItem) {
                while (newItem.length > 0) {
                    setTimeout(1000);
                    var firstIndex = newItem.indexOf('^', 0);
                    var secIndex = newItem.indexOf('^', firstIndex + 1);
                    var thirdIndex = newItem.indexOf('^', secIndex + 1);
                    var fourthIndex = newItem.indexOf('^', thirdIndex + 1);
                    var fifthIndex = newItem.indexOf('^', fourthIndex + 1);
                    var sixthIndex = newItem.indexOf('^', fifthIndex + 1);
                    var seventhIndex = newItem.indexOf('^', sixthIndex + 1);
                    var eigthIndex = newItem.indexOf('^', seventhIndex + 1);
                    var ninthIndex = newItem.indexOf('^', eigthIndex + 1);
                    var tenthIndex = newItem.indexOf('|', ninthIndex + 1);

                    var name = newItem.substring(0, firstIndex);
                    var description = newItem.substring(firstIndex + 1, secIndex);
                    var organisationName = newItem.substring(secIndex + 1, thirdIndex);
                    var x = newItem.substring(thirdIndex + 1, fourthIndex);
                    var y = newItem.substring(fourthIndex + 1, fifthIndex);
                    var startDate = newItem.substring(fifthIndex + 1, sixthIndex);
                    var dueDate = newItem.substring(sixthIndex + 1, seventhIndex);
                    var grandParentName = newItem.substring(seventhIndex + 1, eigthIndex);
                    var targetValue = newItem.substring(eigthIndex + 1, ninthIndex);
                    var parentName = newItem.substring(ninthIndex + 1, tenthIndex);

                    var measure = bsType.createMeasure(new Point(x, y));

                    measure.name = name;
                    measure.description = description;
                    measure.organisationName = organisationName;
                    measure.startDate = startDate;
                    measure.dueDate = dueDate;
                    measure.targetValue = targetValue;
                    measure.isEditing = false;

                    for (var i = 0; i < global.perspectiveArray.length; i++) {
                        if (global.perspectiveArray[i].name === grandParentName) {
                            var parentGoals = global.perspectiveArray[i].children;

                            for (var j = 0; j < parentGoals.length; j++) {
                                if (parentGoals[j].name === parentName) {
                                    measure.bsParent = parentGoals[j];
                                    parentGoals[j].addChildObject(measure);
                                    break;
                                }
                            }
                        }
                    }

                    newItem = newItem.substring(tenthIndex + 1, newItem.length)
                }
            });

            ajax.get('/JSON/GetCompletionScores', function (newItem) {
                while (newItem.length > 0) {
                    var firstIndex = newItem.indexOf('^', 0);
                    var secIndex = newItem.indexOf('^', firstIndex + 1);
                    var thirdIndex = newItem.indexOf('^', secIndex + 1);
                    var fourthIndex = newItem.indexOf('^', thirdIndex + 1);
                    var fifthIndex = newItem.indexOf('|', fourthIndex + 1);

                    var time = newItem.substring(0, firstIndex);
                    var currentValue = newItem.substring(firstIndex + 1, secIndex);
                    var measureName = newItem.substring(secIndex + 1, thirdIndex);
                    var goalName = newItem.substring(thirdIndex + 1, fourthIndex);
                    var perspectiveName = newItem.substring(fourthIndex + 1, fifthIndex);

                    for (var i = 0; i < global.perspectiveArray.length; i++) {
                        if (global.perspectiveArray[i].name == perspectiveName) {
                            var goals = global.perspectiveArray[i].children;

                            for (var j = 0; j < goals.length; j++) {
                                if (goals[j].name == goalName) {
                                    var measures = goals[j].children;

                                    for (var k = 0; k < measures.length; k++) {
                                        if (measures[k].name == measureName) {
                                            measures[k].currentValue = currentValue;

                                            measures[k].updateCompletionRatios(time);
                                            measures[k].bsParent.calculateCompletionRatio();
                                            measures[k].bsParent.bsParent.completionRatio();
                                        }
                                    }
                                }
                            }
                        }
                    }

                    newItem = newItem.substring(fifthIndex + 1, newItem.length)
                }
            });

            if (global.perspectiveArray.length > 0) {
                viewItem(global.perspectiveArray[0], true);
            }
        }

        var pageEvents = (function () {
            // mousedown event handler
            mousedown = function (event) {
                if (!global.isGraphing) {
                    if (event.target === this) {
                        viewItem(global.bsParent, true);
                    }
                }
                else {
                    if (global.bsParent != undefined) {
                        bsCurrentView.innerHTML = global.bsParent.name;
                    }
                    else {
                        bsCurrentView.innerHTML = 'All Perspectives';
                    }

                    viewParentImage.src = "../../Images/controls/drawing-page/viewParent.png"

                    var canvas = document.getElementById('graph-canvas');
                    var map = document.getElementById('map-page');

                    if (canvas.style.display !== 'none') {
                        canvas.style.display = 'none';
                    }

                    if (map.style.display !== 'none') {
                        map.style.display = 'none';
                    }

                    main.page.style.display = 'block';

                    global.isGraphing = false;
                }
            },

            // dragover event handler
            mousedragover = function (event) {
                event.preventDefault();
            }

            mousedrop = function (event) {
                event.preventDefault();
                var success = false;
                var data = event.dataTransfer.getData("thumb");
                var bsItem;

                switch (data) {
                    case ('perspective'):
                        if (global.bsLevel == undefined) {
                            success = true;

                            bsItem = bsType.createPerspective(currentPosition(event));

                            for (var i = 0; i < global.perspectiveArray.length; i++) {
                                if (bsItem.name === global.perspectiveArray[i].name) {
                                    success = false;
                                    break;
                                }
                            }

                            if (success) {
                                bsItem.bsParent = undefined;
                                bsItem.organisationName = document.getElementById('organisation-name').innerHTML;
                                global.perspectiveArray.push(bsItem);
                                //ajax.perspective('/JSON/AddPerspective', bsItem);
                            }
                            else {
                                alert('Please rename and save ' + bsItem.name + ' before attempting to add a new ' + bsItem.type + ' to the canvas.');
                            }
                        }
                        break;
                    case ('goal'):
                        if (global.bsLevel == 'perspective') {
                            bsItem = bsType.createGoal(currentPosition(event));
                            bsItem.bsParent = global.bsParent;
                            success = bsItem.bsParent.addChildObject(bsItem);

                            if (success) {
                                bsItem.organisationName = document.getElementById('organisation-name').innerHTML;
                                //ajax.goal('/JSON/AddGoal', bsItem);
                            }
                        }
                        break;
                    case ('measure'):
                        if (global.bsLevel == 'goal') {
                            bsItem = bsType.createMeasure(currentPosition(event));
                            bsItem.bsParent = global.bsParent;
                            success = bsItem.bsParent.addChildObject(bsItem);

                            if (success) {
                                bsItem.organisationName = document.getElementById('organisation-name').innerHTML;
                                ajax.measure('/JSON/AddMeasure', bsItem);
                            }
                        }
                        break;
                    default: return;
                }

                if (bsItem != undefined &&
                    success) {
                    canvasObject.create(bsItem);
                }
            }

            // expose members
            return {
                mousedown: mousedown,
                mousedragover: mousedragover,
                mousedrop: mousedrop
            }
        }());

        // add mouse event listeners to page and drawing pane
        page.addEventListener("dragover", pageEvents.mousedragover, false);
        page.addEventListener("drop", pageEvents.mousedrop, false);

        viewParentImage.addEventListener("mousedown", pageEvents.mousedown, false);
        populateItems();
    }

    // initilalize the main.js script when the window loads
    window.addEventListener("load", init, false);

    // expose members
    return {
        init: init,
        page: page,
        currentPosition: currentPosition,
        currentView: bsCurrentView,
        viewItem: viewItem,
        viewParentImage: viewParentImage,
        clearPage: clearPage
    };
}());
