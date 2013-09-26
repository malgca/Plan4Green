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

        //setPerspectives;
        //ajax.get('/JSON/GetOrganisation', function (ajaxInfo) {
        //});

        //setGoals;
        //ajaxGet('/JSON/GetOrganisation', function (ajaxInfo) {
        //});

        //setMeasures;
        //ajaxGet('/JSON/GetOrganisation', function (ajaxInfo) {
        //});
    }

    // add BS item information to the drawing pane.
    addBSItem = function (bsItem) {
        // wrap item in anchor tag
        var anchor = document.createElement('a');
        anchor.href = '#' + bsItem.name;
        anchor.innerHTML = bsItem.name;

        anchorClick = function (event) {
            console.log(bsItem);
            main.viewItem(bsItem, false);
        }

        anchor.addEventListener("click", anchorClick, false);

        // create table row wrapper
        var tableRow = document.createElement('tr');
        // create name entry
        var entryName = document.createElement('td');
        entryName.id = bsItem.name;
        entryName.appendChild(anchor);
        entryName.className = 'viewName';

        tableRow.appendChild(entryName);

        if (bsItem.type != 'perspective') {
            // create id entry
            var entryID = document.createElement('td');
            entryID.id = bsItem.completionRatio();
            entryID.className = 'viewID';

            if (bsItem.type == 'goal') {
                entryID.innerHTML = bsItem.currentValue();
                console.log(bsItem.currentValue() + ' / ' + bsItem.targetValue() + ' = ' + bsItem.completionRatio());
            }
            else {
                entryID.innerHTML = bsItem.currentValue;
                console.log(bsItem.currentValue + ' / ' + bsItem.targetValue + ' = ' + bsItem.completionRatio());
            }

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
            },

            // event fired when the strategy map link is clicked
            mapClick = function (event) {
                strategyMap.draw();
            },

            // event fired when the time frame link is clicked
            frameClick = function (event) {
                // make navigation invisible, make time frame visible
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

                    pane.controlarrow.src = "../../Images/controls/drawing-pane/dp-arrow-open.png"
                }
                else {
                    pane.isPaneOut = true;

                    pane.info.style.width = "300px";
                    pane.info.style.display = "block";
                    pane.tools.style.left = "300px";

                    pane.controlarrow.src = "../../Images/controls/drawing-pane/dp-arrow-closed.png"
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
        redrawBSItems:redrawBSItems
    }
}());