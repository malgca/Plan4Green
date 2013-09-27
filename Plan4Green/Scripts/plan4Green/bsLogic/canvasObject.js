var canvasObject = (function () {
    // create the parent div for the bsItem.
    var createDiv = function (divItem) {
        // outer wrapper div.
        var div = document.createElement('div');

        div.setAttribute('id', divItem.name + '' + debug.count);
        div.className = 'canvasObject';

        debug.count++;

        // set the div to the mouse click 
        div.style.left = divItem.currentPosition.x + 'px';
        div.style.top = divItem.currentPosition.y + 'px';

        return div;
    }

    // draw a BS Item.
    var drawBSItem = function (bsItem) {
        var
            pos = goal.currentPosition,
            div = createDiv(bsItem),

            bsImage = new Image();

        // update a BS item div
        updateBSItemInfo = function (bsItem, workingID) {
            var edits = document.getElementById(workingID + '-bsEditList');
            var views = document.getElementById(workingID + '-bsViewList');

            if (bsItem.type == 'perspective') {
                // update name
                if (bsValidation.validName(bsItem, edits.childNodes[0].firstChild.value)) {
                    bsItem.name = edits.childNodes[0].firstChild.value;
                    views.childNodes[0].firstChild.innerHTML = bsItem.name;
                    edits.childNodes[0].firstChild.style.color = '#2e2e2e';
                }
                else {
                    edits.childNodes[0].firstChild.style.color = '#ff0000';
                }

                // update description
                bsItem.description = edits.childNodes[1].firstChild.value;
                views.childNodes[2].firstChild.innerHTML = bsItem.description;
            }
            else {
                // update bsItem
                if (bsValidation.validName(bsItem, edits.childNodes[0].firstChild.value)) {
                    bsItem.name = edits.childNodes[0].firstChild.value;
                    views.childNodes[0].firstChild.innerHTML = bsItem.name;
                    edits.childNodes[0].firstChild.style.color = '#2e2e2e';
                }
                else {
                    edits.childNodes[0].firstChild.style.color = '#ff0000';
                }

                if (bsValidation.validDate(edits.childNodes[1].children[0].children[1].value, edits.childNodes[2].children[0].children[1].value)) {
                    bsItem.startDate = edits.childNodes[1].children[0].children[1].value;
                    bsItem.dueDate = edits.childNodes[2].children[0].children[1].value;

                    // update views
                    views.childNodes[1].children[0].style.color = '#151515';
                    views.childNodes[1].children[0].style.fontWeight = '400';
                }
                else {
                    views.childNodes[1].children[0].style.color = '#ff0000';
                    views.childNodes[1].children[0].style.fontWeight = '600';
                }

                bsItem.description = edits.childNodes[3].firstChild.value;

                if (bsItem.type == 'measure') {
                    bsItem.targetValue = bsValidation.validValue(edits.childNodes[5].firstChild.children[1].value, 10000000);
                    edits.childNodes[5].firstChild.children[1].value = bsItem.targetValue;

                    console.log('target: ' + bsItem.targetValue);

                    bsItem.currentValue = bsValidation.validValue(edits.childNodes[4].firstChild.children[1].value, bsItem.targetValue);
                    edits.childNodes[4].firstChild.children[1].value = bsItem.currentValue;

                    console.log('current: ' + bsItem.currentValue);

                    // update view
                    views.childNodes[4].firstChild.innerHTML = 'Target: ' + bsItem.targetValue;
                }

                // update views
                views.childNodes[1].firstChild.innerHTML = 'Due: ' + bsItem.dueDate;
                views.childNodes[2].firstChild.innerHTML = bsItem.description;

                if (bsItem.type == 'goal') {
                    views.childNodes[4].firstChild.innerHTML = 'Target: ' + bsValidation.validValue(bsItem.targetValue(), 10000000);
                }
            }
        }

        createControls = function () {
            var controls = new Array();

            var controlList = document.createElement('ul');
            controlList.id = div.id + '-bsControlList';

            // events executed on the image
            imgEvents = (function () {
                var
                // flag indicates whether an object is busy dragging
                isDragging,
                // flag indicates whether an object has been dragged
                hasDragged,

                // canvas mousedown event handler
                mousedown = function (event) {
                    if (isDragging) {
                        isDragging = false;
                    }
                    else {
                        isDragging = true;
                    }

                    hasDragged = false;
                    div.style.zIndex = '10';
                },

                // canvas mouseup event handler
                mouseup = function (event) {
                    div.style.zIndex = '3';
                    hasDragged = false;

                    bsItem.currentPosition = main.currentPosition(event);
                },

                // canvas mousedrag event handler
                mousedrag = function (event) {
                    if (isDragging) {
                        hasDragged = true;

                        // get the current mouse position
                        var pos = main.currentPosition(event);

                        if (div.offsetLeft - 4 >= 0
                            && (div.offsetWidth + pos.x - bsImage.width / 2) < main.page.offsetWidth) {
                            // move the perspective by image middle
                            div.style.left = (pos.x - bsImage.width / 2) + 'px';
                        }

                        if (div.offsetTop - 13 >= 0
                            && (div.offsetHeight + pos.y - bsImage.width / 2 + 2) < main.page.offsetHeight) {
                            // move the perspective by image middle
                            div.style.top = (pos.y - bsImage.height) + 'px';
                        }
                    }
                },

                // canvas mouseout event handler
                mouseout = function (event) {
                    isDragging = false;
                    hasDragged = false;
                }

                return {
                    mousedown: mousedown,
                    mouseup: mouseup,
                    mousedrag: mousedrag,
                    mouseout: mouseout
                }
            }());

            bsImage.draggable = false;
            bsImage.className = 'bsImage';

            if (bsItem.type == 'perspective') {
                bsImage.src = "../../Images/controls/drawing-pane/perspective-active.png";
            }
            else if (bsItem.type == 'goal') {
                bsImage.src = "../../Images/controls/drawing-pane/goal-active.png";
            }
            else if (bsItem.type == 'measure') {
                bsImage.src = "../../Images/controls/drawing-pane/measure-active.png";
            }

            bsImage.addEventListener("mousedown", imgEvents.mousedown, false);
            bsImage.addEventListener("mouseup", imgEvents.mouseup, false);
            bsImage.addEventListener("mousemove", imgEvents.mousedrag, false);
            bsImage.addEventListener("mouseout", imgEvents.mouseout, false);

            controls.push(bsImage);

            var editImage = new Image(35, 35);
            if (bsItem.isEditing) {
                editImage.src = '../../Images/controls/bs-item/save.png';
            } else {
                editImage.src = '../../Images/controls/bs-item/edit.png';
            }

            var controlEvents = (function () {
                editClick = function (event) {
                    if (!bsItem.isEditing) {
                        editImage.src = '../../Images/controls/bs-item/save.png';

                        var viewList = document.getElementById(div.id + "-bsViewList");
                        viewList.style.visibility = 'collapse';
                        viewList.style.width = '0px';
                        viewList.style.height = '0px';

                        var editList = document.getElementById(div.id + "-bsEditList");
                        editList.style.visibility = 'visible';
                        editList.style.width = '350px';
                        editList.style.height = 'inherit';

                        bsItem.isEditing = true;
                    }
                    else {
                        editImage.src = '../../Images/controls/bs-item/edit.png';

                        var viewList = document.getElementById(div.id + "-bsViewList");
                        viewList.style.visibility = 'visible';
                        viewList.style.width = '350px';
                        viewList.style.height = 'inherit';

                        var editList = document.getElementById(div.id + "-bsEditList");
                        editList.style.visibility = 'collapse';
                        editList.style.width = '0px';
                        editList.style.height = '0px';

                        var currentId = editImage.parentElement.parentElement.parentElement.id;

                        updateBSItemInfo(bsItem, currentId);

                        drawingPane.redrawBSItems(bsItem);
                        bsItem.isEditing = false;
                    }
                }

                viewClick = function (event) {
                    main.viewItem(bsItem, false);
                }

                graphClick = function (event) {
                    // follow tutorial
                }

                return {
                    editClick: editClick,
                    viewClick: viewClick,
                    graphClick: graphClick
                }
            }());

            editImage.addEventListener('click', controlEvents.editClick, false);

            if (bsItem.isEnabled) {
                controls.push(editImage);
            }

            if (bsItem.type != 'measure') {
                var viewImage = new Image(35, 35);
                viewImage.src = '../../Images/controls/bs-item/viewChild.png';
                viewImage.addEventListener('click', controlEvents.viewClick, false);

                controls.push(viewImage);
            }

            if (bsItem.type != 'perspective') {
                var graphImage = new Image(35, 35);
                graphImage.src = '../../Images/controls/bs-item/graph.png';
                graphImage.addEventListener('click', controlEvents.graphClick, false);

                if (bsItem.isEnabled) {
                    controls.push(graphImage);
                }
            }

            // create list item nodes and place items inside
            for (var i = 0; i < controls.length; i++) {
                var listItem = document.createElement('li');
                listItem.appendChild(controls[i]);
                controlList.appendChild(listItem);
            }

            return controlList;
        },

        createView = function () {
            var views = new Array();

            var viewList = document.createElement('ul');
            viewList.id = div.id + '-bsViewList';

            var createStoplight = function (bsItem) {
                var canvas = document.createElement('canvas');
                canvas.style.position = 'absolute';
                canvas.style.left = '85px';
                canvas.style.zIndex = '-5'

                if (bsItem.type == 'perspective') {
                    canvas.height = 10;
                }
                else {
                    canvas.height = 15;
                }

                // get the canvas context for the gradient
                var context = canvas.getContext('2d');
                // fill canvas with gradient color
                var linearGradient = context.createLinearGradient(0, 0, 0, 50);
                linearGradient.addColorStop(0.3, "#ff0000");
                linearGradient.addColorStop(0.7, "#000000");

                context.fillStyle = linearGradient;
                context.fillRect(0, 0, canvas.width, canvas.height);
                return canvas;
            }

            // measure heading text label
            var heading = document.createElement('h1');
            heading.innerHTML = bsItem.name;

            views.push(heading); // heading always goes first

            // create the stoplight indicator for the bsItem
            var stoplight = createStoplight(bsItem);

            if (bsItem.isEnabled) {
                // measure description
                var description = document.createElement('p');
                description.innerHTML = bsItem.description;

                var dueDate,
                    target;

                if (bsItem.type == 'goal' || bsItem.type == 'measure') {

                    // item due date
                    dueDate = document.createElement('label');
                    dueDate.className = 'bsItemDue';
                    dueDate.innerHTML = 'Due  ' + bsItem.dueDate;

                    // item target
                    target = document.createElement('p');
                    target.className = 'bsItemDue';
                    if (bsItem.type == 'goal') {
                        target.innerHTML = 'of ' + bsValidation.validValue(bsItem.targetValue());
                    }
                    else {
                        target.innerHTML = 'of ' + bsItem.targetValue;
                    }
                }
            }

            if (bsItem.type == 'perspective') { // perspective stoplight go second
                views.push(stoplight);
            }
            else { //otherwise, due dates go next
                if (bsItem.isEnabled) {
                    views.push(dueDate);
                }
            }

            if (bsItem.isEnabled) {
                views.push(description);
            }

            if (bsItem.type != 'perspective') {
                views.push(stoplight);

                if (bsItem.isEnabled) {
                    views.push(target);
                }
            }

            // put all the items in the viewList
            for (var i = 0; i < views.length; i++) {
                var listItem = document.createElement('li');
                listItem.appendChild(views[i]);

                if (i == 0) {
                    views[i].parentElement.className = 'viewHeading';
                }
                else {
                    views[i].parentElement.className = 'viewItem';
                }
                viewList.appendChild(listItem);
            }

            return viewList;
        },

        createEdit = function () {
            var edits = new Array();

            var editList = document.createElement('ul');
            editList.id = div.id + '-bsEditList';

            // heading text editor
            var headingEdit = document.createElement('input');
            headingEdit.type = 'text';
            headingEdit.value = bsItem.name;

            edits.push(headingEdit);

            if (bsItem.type != 'perspective') {
                var startList = document.createElement('li');

                var startDateLabel = document.createElement('label');
                startDateLabel.innerHTML = 'Start Date';
                startDateLabel.style.paddingRight = '20px';

                var startDateEdit = document.createElement('input');
                startDateEdit.type = 'date';

                var date = new Date();
                var dateString;

                dateString = date.getFullYear() + '-'
                    + ('0' + (date.getMonth() + 1)).slice(-2) + '-'
                    + ('0' + date.getDate()).slice(-2);

                startDateEdit.value = dateString;
                bsItem.startDate = dateString;
                startList.appendChild(startDateLabel);
                startList.appendChild(startDateEdit);

                edits.push(startList);

                var dueList = document.createElement('li');

                var dueDateLabel = document.createElement('label');
                dueDateLabel.innerHTML = 'Due Date';
                dueDateLabel.style.paddingRight = '26px';

                var dueDateEdit = document.createElement('input');
                dueDateEdit.type = 'date';
                dueDateEdit.value = dateString;
                bsItem.dueDate = dateString;

                dueList.appendChild(dueDateLabel);
                dueList.appendChild(dueDateEdit);

                edits.push(dueList);
            }

            var descriptionEdit = document.createElement('textarea');
            descriptionEdit.value = bsItem.description;

            edits.push(descriptionEdit);

            if (bsItem.type == 'measure') {
                var targetList = document.createElement('li');

                var targetLabel = document.createElement('label');
                targetLabel.innerHTML = 'Target';
                targetLabel.style.paddingRight = '20px';
                targetLabel.style.display = 'block';

                targetList.appendChild(targetLabel);

                var targetEdit = document.createElement('input');
                targetEdit.type = 'number';
                targetEdit.value = bsItem.targetValue;
                targetEdit.max = 10000000;

                targetList.appendChild(targetEdit);

                var currentList = document.createElement('li');

                var currentLabel = document.createElement('label');
                currentLabel.innerHTML = 'Current';
                currentLabel.style.paddingRight = '10px';
                currentLabel.style.display = 'block';

                currentList.appendChild(currentLabel);

                var currentEdit = document.createElement('input');
                currentEdit.type = 'number';
                currentEdit.value = bsItem.currentValue;
                currentEdit.max = 10000000;

                currentList.appendChild(currentEdit);

                edits.push(currentList);

                edits.push(targetList);
            }

            // put all the items in the edit list
            for (var i = 0; i < edits.length; i++) {
                var listItem = document.createElement('li');
                listItem.appendChild(edits[i]);

                if (i == 0) {
                    edits[i].parentElement.className = 'viewHeading';
                }
                else {
                    edits[i].parentElement.className = 'viewItem';
                }

                if (bsItem.type == 'measure') {
                    if (i == 4) {
                        edits[i].parentElement.style.display = 'inline-block';
                        edits[i].parentElement.style.marginLeft = '35px';
                    } else if (i == 5) {
                        edits[i].parentElement.style.display = 'inline-block';
                        edits[i].parentElement.style.marginLeft = '55px';
                    }
                }

                editList.appendChild(listItem);
            }

            return editList;
        }

        var controlBar = createControls();
        var viewBar = createView();
        var editBar = createEdit();

        // set the correct view based on whether or not the item is being editted.
        if (bsItem.isEditing) {
            viewBar.style.visibility = 'collapse';
            viewBar.style.width = '0px';
            viewBar.style.height = '0px';

            editBar.style.visibility = 'visible';
            editBar.style.width = '350px';
            editBar.style.height = 'inherit';
        }
        else {
            viewBar.style.visibility = 'visible';
            viewBar.style.width = '350px';
            viewBar.style.height = 'inherit';

            editBar.style.visibility = 'collapse';
            editBar.style.width = '0px';
            editBar.style.height = '0px';
        }

        div.appendChild(controlBar);
        div.appendChild(viewBar);

        if (bsItem.isEnabled) {
            div.appendChild(editBar);
        }
        // place the div on the drawing page
        main.page.appendChild(div);
    },

    // constructor
    create = function (bsItem) {
        drawBSItem(bsItem);
        drawingPane.redrawBSItems(bsItem);
    };

    // expose members
    return {
        create: create,
    };
}());