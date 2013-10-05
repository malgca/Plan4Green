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
        // just make sure the completionRatio has been calculated
        if (bsItem.type == 'perspective') {
            bsItem.completionRatio();
        }
        else if (bsItem.type == 'goal') {
            bsItem.calculateCompletionRatio();
        }

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
                if (bsItem.name !== edits.childNodes[0].firstChild.value) {
                    if (bsValidation.validName(bsItem, edits.childNodes[0].firstChild.value)) {
                        bsItem.changeName(edits.childNodes[0].firstChild.value);
                        views.childNodes[0].firstChild.innerHTML = bsItem.name;
                        edits.childNodes[0].firstChild.style.color = '#2e2e2e';
                    }
                    else {
                        edits.childNodes[0].firstChild.style.color = '#ff0000';
                    }
                }

                // update description
                if (bsItem.description !== edits.childNodes[1].firstChild.value) {
                    bsItem.description = edits.childNodes[1].firstChild.value;
                    views.childNodes[2].firstChild.innerHTML = bsItem.description;
                }
            }
            else {
                // update bsItem
                if (bsItem.name !== edits.childNodes[0].firstChild.value) {
                    if (bsValidation.validName(bsItem, edits.childNodes[0].firstChild.value)) {
                        bsItem.name = edits.childNodes[0].firstChild.value;
                        views.childNodes[0].firstChild.innerHTML = bsItem.name;
                        edits.childNodes[0].firstChild.style.color = '#2e2e2e';
                    }
                    else {
                        edits.childNodes[0].firstChild.style.color = '#ff0000';
                    }
                }

                if (bsItem.startDate !== edits.childNodes[1].children[0].children[1].value ||
                    bsItem.dueDate !== edits.childNodes[2].children[0].children[1].value) {
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
                }

                if (bsItem.description !== edits.childNodes[3].firstChild.value) {
                    bsItem.description = edits.childNodes[3].firstChild.value;
                }

                if (bsItem.type == 'measure') {
                    if (bsItem.targetValue !== edits.childNodes[5].firstChild.children[1].value) {
                        bsItem.targetValue = bsValidation.validValue(edits.childNodes[5].firstChild.children[1].value, 10000000);
                        edits.childNodes[5].firstChild.children[1].value = bsItem.targetValue;
                    }

                    if (bsItem.currentValue !== edits.childNodes[4].firstChild.children[1].value) {
                        bsItem.currentValue = bsValidation.validValue(edits.childNodes[4].firstChild.children[1].value, bsItem.targetValue);
                        edits.childNodes[4].firstChild.children[1].value = bsItem.currentValue;

                        bsItem.calculateCompletionRatio();
                        bsItem.bsParent.calculateCompletionRatio();
                        drawingPane.redrawBSItems(bsItem.bsParent);
                        bsStoplight.update(bsItem, div);
                        //ajax.ratio('/JSON/AddCompletionScore', bsItem);
                    }

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

            switch (bsItem.type) {
                case 'perspective':
                    ajax.perspective('/JSON/UpdatePerspective', bsItem);

                    break;
                case 'goal':
                    ajax.goal('/JSON/UpdateGoal', bsItem);
                    break;
                case 'measure':
                    ajax.measure('/JSON/UpdateMeasure', bsItem);
                    break;
            }

            bsItem.nameHasChanged = false;
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
                        viewList.style.display = 'none';

                        var editList = document.getElementById(div.id + "-bsEditList");
                        editList.style.display = 'inline-block';

                        bsItem.isEditing = true;
                    }
                    else {
                        editImage.src = '../../Images/controls/bs-item/edit.png';

                        var viewList = document.getElementById(div.id + "-bsViewList");
                        viewList.style.display = 'inline-block';

                        var editList = document.getElementById(div.id + "-bsEditList");
                        editList.style.display = 'none';

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
                    var prepCanvas = function () {
                        var canvas = document.getElementById('graph-canvas');

                        canvas.style.display = 'inline-block';
                        main.page.style.display = 'none';
                        main.viewParentImage.src = '../../Images/controls/drawing-page/exit-icon.png';
                        main.currentView.innerHTML = 'Completion Graph: ' + bsItem.name;
                        global.isGraphing = true;
                    }

                    if (bsItem.type == 'goal') { // move code to measures
                        if (bsItem.children.length > 0) {
                            prepCanvas();

                            var nameArray = [];
                            var valueArray = [];

                            for (var i = 0; i < bsItem.children.length; i++) {
                                nameArray.push(bsItem.children[i].name);
                                valueArray.push(bsItem.children[i].completionRatios[bsItem.children[i].completionRatios.length - 1]);
                            }

                            graph.setXAxisLabels(nameArray);
                            graph.setGraphValues(valueArray);
                        }
                        else {
                            alert('Please place at least one measure within ' + bsItem.name + ' before attempting to draw a graph.');
                        }
                    }
                    else {
                        if (bsItem.completionRatios.length > 0) {
                            prepCanvas();

                            graph.setXAxisLabels(bsItem.completionTimes);
                            graph.setGraphValues(bsItem.completionRatios);
                        }
                        else {
                            alert('Please enter and save at least one Current and Target value into ' + bsItem.name + ' before attempting to make a graph.');
                        }
                    }
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
                canvas.id = div.id + '-stoplight';
                canvas.style.position = 'absolute';
                canvas.style.left = '85px';
                canvas.style.zIndex = '-5'

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
                    if (bsItem.type == 'goal') {
                        target.style.margin = '25px';
                        target.innerHTML = 'Target: ' + bsValidation.validValue(bsItem.targetValue());
                    }
                    else {
                        target.innerHTML = 'Target: ' + bsItem.targetValue;
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
                console.log('disabled and in');
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
            viewBar.style.display = 'none';
            editBar.style.display = 'inline-block';
        }
        else {
            viewBar.style.display = 'inline-block';
            editBar.style.display = 'none';
        }

        div.appendChild(controlBar);
        div.appendChild(viewBar);

        if (bsItem.isEnabled) {
            div.appendChild(editBar);
        }
        
        // place the div on the drawing page
        main.page.appendChild(div);
        bsStoplight.draw(bsItem, div);
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