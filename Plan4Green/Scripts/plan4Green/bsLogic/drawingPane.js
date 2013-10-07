// The image drawing pane
var drawingPane = (function () {
    // drawing panel from which to get the drawing items
    pane = {
        // pane housing information about the page
        info: document.getElementById("info"),
        // organisations name
        orgName: document.getElementById("organisation-name"),
        // div housing info tables on the page
        infoTables: document.getElementById("info-tables"),
        // perspective info list
        persInfo: document.getElementById("perspective-list"),
        // goal info list
        goalInfo: document.getElementById("goal-list"),
        // measure info list
        measInfo: document.getElementById("measure-list"),
        // div housing time frame information
        timeInfo: document.getElementById("timeframe-info"),
        // input for the starting of the valid time frame
        startFrame: document.getElementById("startFrame"),
        // input for the end of the valid time frame
        endFrame: document.getElementById("endFrame"),
        // done button for selecting time frames
        frameBtn: document.getElementById("frameBtn"),
        // link to create strategy map
        mapLink: document.getElementById("mapLink"),
        // link to view valid time frame
        timeLink: document.getElementById("timeLink"),
        // pane housing all drawing tools
        tools: document.getElementById("tools"),
        // drawing pane control arrow
        controlarrow: document.getElementById("control-arrow"),
        // perspective control in drawing pane
        perspective: document.getElementById("perspective"),
        // goal control in drawing pane
        goal: document.getElementById("goal"),
        // measure control in drawing pane
        measure: document.getElementById("measure"),
        // area of the information pane
        area: document.getElementById("area"),
        // flag representing whether or not pane is out
        isPaneOut: false
    },

    // set an organisations session information according to info in the DB.
    setSessionDetails = function () {
        //setOrganisationDetails;
        ajax.get('/JSON/GetOrganisation', function (ajaxInfo) {
            var orgNameShort = "";

            if (ajaxInfo.length > 20) {
                orgNameShort = ajaxInfo.slice(0, 20);
                orgNameShort += '...';
                pane.orgName.innerHTML = orgNameShort;
            }
            else {
                pane.orgName.innerHTML = ajaxInfo;
            }
        });

        //setUserName;
        ajax.get('/JSON/GetUsername', function (ajaxInfo) {
            document.getElementById("user-name").innerHTML = ajaxInfo;
        });
    }

    // add BS item information to the drawing pane.
    addBSItem = function (bsItem) {
        // create table row wrapper
        var tableRow = document.createElement('tr');
        // create name entry
        var entryName = document.createElement('td');
        entryName.id = bsItem.name;
        entryName.innerHTML = bsItem.name;
        entryName.className = 'viewName';

        entryName.addEventListener("click", function (event) {
            main.viewItem(bsItem, true);
            if (bsItem.type != 'perspective') {
                redrawBSItems(bsItem.bsParent);
            }
        }, false);

        if (bsItem.isActive) {
            entryName.style.backgroundColor = '#666600'
        }

        tableRow.appendChild(entryName);

        if (bsItem.type != 'perspective') {
            // create id entry
            var entryID = document.createElement('td');
            entryID.id = bsItem.name + 'currentCompletion';
            entryID.className = 'viewID';

            if (bsItem.isActive) {
                entryID.style.backgroundColor = '#666600'
            }

            if (bsItem.completionRatios[bsItem.completionRatios.length - 1] != undefined &&
                !isNaN(bsItem.completionRatios[bsItem.completionRatios.length - 1])) {
                entryID.innerHTML = bsItem.completionRatios[bsItem.completionRatios.length - 1].toFixed(0) + '%';
            }
            else {
                entryID.innerHTML = 0 + '%';
            }

            entryID.addEventListener("click", function (event) {
                main.viewItem(bsItem, true);
                redrawBSItems(bsItem.bsParent);
            }, false);
            tableRow.appendChild(entryID);
        }

        switch (bsItem.type) {
            case ("perspective"):
                pane.persInfo.appendChild(tableRow);
                break;
            case ("goal"):
                pane.goalInfo.appendChild(tableRow);
                break;
            case ("measure"):
                pane.measInfo.appendChild(tableRow);
                break;
            default:
                break;
        }
    }

    // clears the BS object pane for a specific type of object
    clearBSItems = function (type) {
        if (type == 'perspective') {
            while (pane.persInfo.childElementCount > 0) {
                pane.persInfo.removeChild(pane.persInfo.firstChild);
            }
        }
        else if (type == 'goal') {
            while (pane.goalInfo.childElementCount > 0) {
                pane.goalInfo.removeChild(pane.goalInfo.firstChild);
            }
        }
        else {
            while (pane.measInfo.childElementCount > 0) {
                pane.measInfo.removeChild(pane.measInfo.firstChild);
            }
        }
    }

    // re-adds a specific level of bs items on the drawing pane.
    redrawBSItems = function (bsItem) {
        // clear the currently existing BS items
        clearBSItems(bsItem.type);
        console.log(bsItem.type);

        // redraw only the section which matters
        if (bsItem.type == 'perspective') {
            for (var i = 0; i < global.perspectiveArray.length; i++) {
                addBSItem(global.perspectiveArray[i]);
            }
        }
        else {
            for (var i = 0; i < bsItem.bsParent.children.length; i++) {
                addBSItem(bsItem.bsParent.children[i]);
            }
        }
    }

    init = function () {
        // set the organisation information
        setSessionDetails();

        infoEvents = (function () {
            var
            // event fired when the done button is clicked.
            doneClick = function (event) {
                // iterate through everything, and disable those things which aren't in the valid timeframe, then go back to perspective view
                var perspectives = global.perspectiveArray;

                if (perspectives.length > 0) {
                    for (var i = 0; i < perspectives.length; i++) {
                        var goals = perspectives[i].children;

                        if (goals.length > 0) {
                            for (var j = 0; j < goals.length; j++) {
                                var measures = goals[j].children;

                                if (measures.length > 0) {
                                    for (var k = 0; k < measures.length; k++) {

                                        if (bsValidation.validDate(pane.startFrame.value, measures[k].startDate)
                                        && bsValidation.validDate(measures[k].dueDate, pane.endFrame.value)) {
                                            measures[k].enableItem();
                                        }
                                        else {
                                            measures[k].disableItem();
                                        }
                                    }

                                    if (goals[j].allChildrenDisabled()) {
                                        goals[j].disableItem();
                                    }
                                    else {
                                        goals[j].enableItem();
                                    }
                                }
                                else {
                                    goals[j].disableItem();
                                }
                            }
                        }
                        else {
                            perspectives[i].disableItem();
                        }

                        if (perspectives[i].allChildrenDisabled()) {
                            perspectives[i].disableItem();
                        }
                        else {
                            perspectives[i].enableItem();
                        }
                    }
                }
                else {
                    alert('Please place a perspective on the canvas before attempting to alter time frames.');
                }

                main.viewItem(perspectives[0], true);
            },

            // event fired when the strategy map link is clicked
            mapClick = function (event) {
                strategyMap.draw();
            },

            // event fired when the time frame link is clicked
            frameClick = function (event) {
                // make navigation invisible, make time frame visible
                if (pane.infoTables.style.visibility == 'visible') {
                    pane.infoTables.style.visibility = 'collapse';
                    pane.timeInfo.style.visibility = 'visible';
                    pane.timeLink.innerHTML = 'View Navigation';
                    pane.area.innerHTML = 'Valid Time Frame';
                }
                else {
                    pane.infoTables.style.visibility = 'visible';
                    pane.timeInfo.style.visibility = 'collapse';
                    pane.timeLink.innerHTML = 'Select Valid Time Frame';
                    pane.area.innerHTML = 'Navigation';
                }
            }

            return {
                doneClick: doneClick,
                mapClick: mapClick,
                frameClick: frameClick
            }
        }());

        // add info events
        pane.frameBtn.addEventListener("click", infoEvents.doneClick, false);
        pane.mapLink.addEventListener("mousedown", infoEvents.mapClick, false);
        pane.timeLink.addEventListener("mousedown", infoEvents.frameClick, false);

        toolEvents = (function () {
            dragstart = function (event) {
                if (event.target.draggable == true) {
                    event.dataTransfer.setData("thumb", event.target.id);
                }
            }

            controlarrowdown = function (event) {
                if (pane.isPaneOut) {
                    pane.isPaneOut = false;

                    pane.info.style.width = "0px";
                    pane.info.style.display = "none";
                    pane.tools.style.left = "0px";

                    pane.controlarrow.src = "../../Images/controls/drawing-pane/dp-arrow-open.png";
                    pane.controlarrow.title = "Show Information Pane";
                }
                else {
                    pane.isPaneOut = true;

                    pane.info.style.width = "300px";
                    pane.info.style.display = "block";
                    pane.tools.style.left = "300px";

                    pane.controlarrow.src = "../../Images/controls/drawing-pane/dp-arrow-closed.png"
                    pane.controlarrow.title = "Hide Information Pane";
                }
            }

            perspectivemouseover = function (event) {
                pane.perspective.src = "../../Images/controls/drawing-pane/perspective-active.png";
            }

            perspectivemouseout = function (event) {
                pane.perspective.src = "../../Images/controls/drawing-pane/perspective-inactive.png";
            }

            goalmouseover = function (event) {
                pane.goal.src = "../../Images/controls/drawing-pane/goal-active.png";
            }

            goalmouseout = function (event) {
                pane.goal.src = "../../Images/controls/drawing-pane/goal-inactive.png";
            }

            measuremouseover = function (event) {
                pane.measure.src = "../../Images/controls/drawing-pane/measure-active.png";
            }

            measuremouseout = function (event) {
                pane.measure.src = "../../Images/controls/drawing-pane/measure-inactive.png";
            }

            return {
                dragstart: dragstart,
                controlarrrowdown: controlarrowdown,
                perspectivemouseover: perspectivemouseover,
                perspectivemouseout: perspectivemouseout,
                goalmouseover: goalmouseover,
                goalmouseout: goalmouseout,
                measuremouseover: measuremouseover,
                measuremouseout: measuremouseout,
            }
        }());

        // add tool events
        pane.tools.addEventListener("dragstart", toolEvents.dragstart, false);
        pane.controlarrow.addEventListener("mousedown", toolEvents.controlarrrowdown, false);
        pane.perspective.addEventListener("mouseover", toolEvents.perspectivemouseover, false);
        pane.perspective.addEventListener("mouseout", toolEvents.perspectivemouseout, false);
        pane.goal.addEventListener("mouseover", toolEvents.goalmouseover, false);
        pane.goal.addEventListener("mouseout", toolEvents.goalmouseout, false);
        pane.measure.addEventListener("mouseover", toolEvents.measuremouseover, false);
        pane.measure.addEventListener("mouseout", toolEvents.measuremouseout, false);     
    }

    // add this set of events to the window on load.
    window.addEventListener("load", init, false);

    return {
        pane: pane,
        clearBSItems: clearBSItems,
        redrawBSItems:redrawBSItems
    }
}());