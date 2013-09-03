// The image drawing pane
var drawingPane = (function () {
    // drawing panel from which to get the drawing items
    pane = {
        // drawing pane housing all drawing tools
        container: document.getElementById("drawing-pane"),
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

    paneEvents = (function () {
        dragstart = function (event) {
            if (event.target.draggable == true) {
                event.dataTransfer.setData("thumb", event.target.id);
            }
        }

        controlarrowdown = function (event) {
            if (pane.isPaneOut) {
                pane.isPaneOut = false;
                pane.controlarrow.src = "../../Images/controls/drawing-pane/dp-arrow-open.png"
            }
            else {
                pane.isPaneOut = true;
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

    pane.container.addEventListener("dragstart", paneEvents.dragstart, false);
    pane.controlarrow.addEventListener("mousedown", paneEvents.controlarrrowdown, false);
    pane.perspective.addEventListener("mouseover", paneEvents.perspectivemouseover, false);
    pane.perspective.addEventListener("mouseout", paneEvents.perspectivemouseout, false);
    pane.goal.addEventListener("mouseover", paneEvents.goalmouseover, false);
    pane.goal.addEventListener("mouseout", paneEvents.goalmouseout, false);
    pane.measure.addEventListener("mouseover", paneEvents.measuremouseover, false);
    pane.measure.addEventListener("mouseout", paneEvents.measuremouseout, false);
}());