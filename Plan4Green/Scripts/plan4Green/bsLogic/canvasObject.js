var canvasObject = (function () {
    // create the parent div for the bsItem.
    var createDiv = function (divItem) {
        // outer wrapper div.
        var div = document.createElement('div');

        div.setAttribute('id', divItem.name + '' + debug.count + '-wrapper');
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

            bsImage = new Image(),

            createControls = function () {
                var controls = new Array();

                var controlList = document.createElement('ul');
                controlList.id = 'bsControlList';

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

                var controlEvents = (function () {
                    isEditing = true;

                    editClick = function (event) {
                        if (!isEditing) {
                            event.target.value = 'Save';

                            var viewList = document.getElementById("bsViewList");
                            viewList.style.visibility = 'collapse';
                            viewList.style.width = '0px';
                            viewList.style.height = '0px';

                            var editList = document.getElementById("bsEditList");
                            editList.style.visibility = 'visible';
                            editList.style.width = '350px';
                            editList.style.height = 'inherit';

                            isEditing = true;
                        }
                        else {
                            event.target.value = 'Edit';

                            var viewList = document.getElementById("bsViewList");
                            viewList.style.visibility = 'visible';
                            viewList.style.width = '350px';
                            viewList.style.height = 'inherit';

                            var editList = document.getElementById("bsEditList");
                            editList.style.visibility = 'collapse';
                            editList.style.width = '0px';
                            editList.style.height = '0px';

                            isEditing = false;
                        }
                    }

                    viewClick = function (event) {
                        global.bsParent = bsItem;
                        global.bsLevel = bsItem.type;
                        main.viewItem(bsItem, false);
                    }

                    graphClick = function (event) {
                    }

                    return {
                        editClick: editClick,
                        viewClick: viewClick,
                        graphClick: graphClick
                    }
                }());

                var editBtn = document.createElement('input');
                editBtn.type = 'submit';
                editBtn.value = 'Save';
                editBtn.addEventListener('click', controlEvents.editClick, false);

                controls.push(editBtn);

                if (bsItem.type != 'measure') {
                    var viewBtn = document.createElement('input');
                    viewBtn.type = 'submit';
                    viewBtn.value = 'View';
                    viewBtn.addEventListener('click', controlEvents.viewClick, false);

                    controls.push(viewBtn);
                }

                if (bsItem.type != 'perspective') {
                    var graphBtn = document.createElement('input');
                    graphBtn.type = 'submit';
                    graphBtn.value = 'Graph';
                    graphBtn.addEventListener('click', controlEvents.graphClick, false);

                    controls.push(graphBtn);
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
                viewList.id = 'bsViewList';

                var createStoplight = function (bsItem) {
                    var canvas = document.createElement('canvas');
                    canvas.style.position = 'absolute';
                    canvas.style.left = '85px';
                    canvas.style.zIndex = '-5'

                    if (bsItem.name == 'Perspective') {
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

                // create the stoplight indicator for the bsItem
                var stoplight = createStoplight(bsItem);

                // measure description
                var description = document.createElement('p');
                description.innerHTML = bsItem.description;

                var dueDate,
                    target;

                if (bsItem.type == 'goal' || bsItem.type == 'measure') {

                    // item due date
                    dueDate = document.createElement('p');
                    dueDate.className = 'bsItemDue';
                    dueDate.innerHTML = 'Due  ' + bsItem.endDate;

                    // item target
                    target = document.createElement('p');
                    target.className = 'bsItemDue';
                    target.innerHTML = 'of ' + bsItem.endDate;
                }

                views.push(heading); // heading always goes first

                if (bsItem.type == 'perspective') { // perspective stoplight go second
                    views.push(stoplight);
                }
                else { //otherwise, due dates go next
                    views.push(dueDate);
                }

                views.push(description);

                if (bsItem.type != 'perspective') {
                    views.push(stoplight);
                    views.push(target);
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
                editList.id = 'bsEditList';

                // heading text editor
                var headingEdit = document.createElement('input');
                headingEdit.type = 'text';
                headingEdit.value = bsItem.name;

                edits.push(headingEdit);

                var descriptionEdit = document.createElement('textarea');
                descriptionEdit.value = bsItem.description;

                edits.push(descriptionEdit);

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

                    editList.appendChild(listItem);
                }

                return editList;
            }

        var controlBar = createControls();
        var viewBar = createView();
        var editBar = createEdit();

        div.appendChild(controlBar);
        div.appendChild(viewBar);
        div.appendChild(editBar);

        // place the div on the drawing page
        main.page.appendChild(div);
    },

    // constructor
    create = function (bsItem) {
        drawBSItem(bsItem);
    };

    // expose members
    return {
        create: create,
    };
}());