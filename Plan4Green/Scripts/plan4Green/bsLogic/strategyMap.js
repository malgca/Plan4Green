// image ref: http://www.duperrin.com/wp-content/uploads/2008/03/strategy-maps-overview-image.gif
// draw perspectives down the sides, goals and measures in balloons.
var strategyMap = (function () {
    var
        map = {
            page: document.getElementById('map-page'),
            table: document.getElementById('map-table')
        },

        // switch to normal view of bs item
        switchView = function (bsItem) {
            map.page.style.display = 'none';
            viewParentImage.src = "../../Images/controls/drawing-page/viewParent.png";
            main.page.style.display = 'block';

            global.isGraphing = false;

            if (bsItem.bsParent != undefined) {
                main.currentView.innerHTML = bsItem.bsParent.name;
            }
            else {
                main.currentView.innerHTML = 'All Perspectives';
            }

            main.viewItem(bsItem, true);
        },

        // draw the goal item for the strategy map
        drawChildItem = function (bsItem, className) {
            var itemDiv = document.createElement('div');
            itemDiv.className = className;

            var text = document.createElement('h3');
            var stoplight = document.createElement('p');

            text.innerHTML = bsItem.name;
            text.style.fontWeight = 600;

            itemDiv.appendChild(text);

            if (bsItem.type === 'perspective') {
                
                if (!isNaN(bsItem.completionRatio())) {
                    stoplight.innerHTML = bsItem.completionRatio() + '%';
                }
                else {
                    stoplight.innerHTML = 0 + '%';
                }
            }
            else {
                var parent = document.createElement('p');
                parent.style.fontSize = '10pt';
                parent.innerHTML = bsItem.bsParent.name;
                itemDiv.appendChild(parent);

                if (bsItem.completionRatios.length > 0) {
                    stoplight.innerHTML = bsItem.completionRatios[bsItem.completionRatios.length - 1] + '%';
                }
                else {
                    stoplight.innerHTML = 0 + '%';
                }
            }

            itemDiv.appendChild(stoplight);

            itemDiv.addEventListener('mousedown',
                function (event) {
                    switchView(bsItem);
                },
                false);

            return itemDiv;
        },

        // draw links between bs items
        drawLinks = function (fromPoint, toPoint) {

        },

    // draw table to house bs items
    drawTable = function () {
        var largestChildren = 0;

        for (var i = 0; i < global.perspectiveArray.length; i++) {
            var goal = global.perspectiveArray[i];
            if (goal.children.length > largestChildren) {
                largestChildren = goal.children.length;
            }
        }

        for (var i = 0; i < global.perspectiveArray.length; i++) {
            var measureRow;
            // create table row wrapper
            var tableRow = document.createElement('tr');
            // create name entry
            var entry = document.createElement('td');
            entry.appendChild(drawChildItem(global.perspectiveArray[i], 'mapPerspective'));
            entry.className = 'viewName';

            tableRow.appendChild(entry);
            var goals = global.perspectiveArray[i].children;

            for (var j = 0; j < goals.length; j++) {
                // create name entry
                var entry = document.createElement('td');
                entry.colSpan = goals[j].children.length;
                entry.appendChild(drawChildItem(goals[j], 'mapGoal'));
                entry.className = 'viewName';

                tableRow.appendChild(entry);

                var measures = goals[j].children;
                var measureRow;

                if (measures.length > 0) {
                    // create table row wrapper
                    var measureRow = document.createElement('tr');
                    // add empty row for padding
                    measureRow.appendChild(document.createElement('td'));
                }

                for (var k = 0; k < measures.length; k++) {
                    var entry = document.createElement('td');
                    entry.appendChild(drawChildItem(measures[k], 'mapMeasure'));
                    entry.className = 'viewName';

                    measureRow.appendChild(entry);
                }
            }

            map.table.appendChild(tableRow);
            if (measureRow != undefined) {
                map.table.appendChild(measureRow);
            }

            // add final line
            var lineRow = document.createElement('tr');
            var line = document.createElement('td');
            line.colSpan = largestChildren + 1;
            var lineBreak = document.createElement('hr');
            line.appendChild(lineBreak);

            lineRow.appendChild(line);
            map.table.appendChild(lineRow);
        }
    },

    // draw a strategy map of the entire BS structure.
        drawMap = function () {
            if (global.perspectiveArray.length > 0) {
                while (map.table.childElementCount > 0) {
                    map.table.removeChild(map.table.lastChild);
                }

                main.viewItem(global.perspectiveArray[0], true);

                main.page.style.display = 'none';
                map.page.style.display = 'block';

                main.viewParentImage.src = '../../Images/controls/drawing-page/exit-icon.png';
                global.isGraphing = true;

                drawTable();
            }
            else {
                alert('Please ensure that there is at least one perspective before attempting to draw a strategy map.');
            }
        },

        draw = function () {
            drawMap();
        }

    return {
        draw: draw
    }
}());