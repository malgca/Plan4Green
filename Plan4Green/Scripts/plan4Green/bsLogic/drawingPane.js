﻿// The image drawing pane
var drawingPane = (function () {
    // drawing panel from which to get the drawing items
    pane = {
        // pane housing information about the page
        info: document.getElementById("info"),
        // organisations name
        orgName: document.getElementById("organisation-name"),
        // perspective info list
        persInfo: document.getElementById("perspective-info"),
        // goal info list
        goalInfo: document.getElementById("goal-info"),
        // measure info list
        measInfo: document.getElementById("measure-info"),
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

    // change an organisations name according to info in the DB.
    setOrganisationName = function () {
        var orgUrl = '/JSON/GetOrganisation';

        $.ajax({
            cache: false,
            type: "POST",
            url: orgUrl,
            data: JSON.stringify(orgUrl),
            dataType: "json",
            success: function (newOrgName) {
                pane.orgName.innerHTML = newOrgName;
            }
        });
    }

    init = function () {
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

        // set the organisation information
        setOrganisationName();
    }

    // add this set of events to the window on load.
    window.addEventListener("load", init, false);
}());