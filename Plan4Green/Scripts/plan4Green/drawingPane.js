// The image drawing pane
var drawingPane = (function () {
    // drawing panel from which to get the drawing items
    pane = {
        // drawing pane housing all drawing tools
        container: document.getElementById("drawing-pane"),
        // perspective control in drawing pane
        perspective: document.getElementById("perspective"),
        // goal control in drawing pane
        goal: document.getElementById("goal"),
        // measure control in drawing pane
        measure: document.getElementById("measure")
    },

    paneEvents = (function () {
        dragstart = function (event) {
            
            event.dataTransfer.setData("thumb", event.target.id);
        }

        perspectivemouseover = function (event) {
            pane.perspective.src = "../../Images/drawing-tools/perspective-active-icon.png";
        }

        perspectivemouseout = function (event) {
            pane.perspective.src = "../../Images/drawing-tools/perspective-inactive-icon.png";
        }

        goalmouseover = function (event) {
            pane.goal.src = "../../Images/drawing-tools/goal-active-icon.png";
        }

        goalmouseout = function (event) {
            pane.goal.src = "../../Images/drawing-tools/goal-inactive-icon.png";
        }

        measuremouseover = function (event) {
            pane.measure.src = "../../Images/drawing-tools/measure-active-icon.png";
        }

        measuremouseout = function (event) {
            pane.measure.src = "../../Images/drawing-tools/measure-inactive-icon.png";
        }

        return {
            dragstart: dragstart,
            perspectivemouseover: perspectivemouseover,
            perspectivemouseout: perspectivemouseout,
            goalmouseover: goalmouseover,
            goalmouseout: goalmouseout,
            measuremouseover: measuremouseover,
            measuremouseout: measuremouseout,
        }
    }());

    pane.container.addEventListener("dragstart", paneEvents.dragstart, false);
    pane.perspective.addEventListener("mouseover", paneEvents.perspectivemouseover, false);
    pane.perspective.addEventListener("mouseout", paneEvents.perspectivemouseout, false);
    pane.goal.addEventListener("mouseover", paneEvents.goalmouseover, false);
    pane.goal.addEventListener("mouseout", paneEvents.goalmouseout, false);
    pane.measure.addEventListener("mouseover", paneEvents.measuremouseover, false);
    pane.measure.addEventListener("mouseout", paneEvents.measuremouseout, false);

    return {
        drawingPane: drawingPane
    }
}());