/* Full credit to William Malone
http://www.williammalone.com/articles/html5-canvas-javascript-bar-graph/
*/
var stoplight = (function () {
    var context = document.getElementById("graph-canvas").getContext("2d");

    var barGraph = new BarGraph(context);
    barGraph.margin = 2;
    barGraph.width = 450;
    barGraph.height = 150;

    // set an array for the x axis labels
    this.setXAxisLabels = function (xAxisArray) {
        barGraph.xAxisLabelArr = xAxisArray;
    }

    // set the graph values to be displayed
    this.setGraphValues = function (valueArray) {
        console.log(valueArray);
        barGraph.update(valueArray);
    }

    // set the max value of the array
    this.setMaxValue = function (maxValue) {
        barGraph.maxValue = maxValue;
    }

    // draws the coloured bar graph onto the screen
    function BarGraph(context) {
        // Private properties and methods
        var
            that = this,
            startArr,
            endArr,
            looping = false,

            // loop methods adjusts the height of bar and redraws is necessary
            loop = function () {
                var delta;
                var animationComplete = true;

                // boolean to prevent update function from looping if already looping
                looping = true;

                // for each bar
                for (var i = 0; i < endArr.length; i++) {
                    // change the current bar height toward it's target height
                    delta = (endArr[i] - startArr[i]) / that.animationSteps;
                    that.curArr[i] += delta;

                    // if any change is made then flip a switch
                    if (delta) {
                        animationComplete = false;
                    }
                }

                // if no change was made to any bars then we are done
                if (animationComplete) {
                    looping = false;
                }
                else {
                    // draw and call loop again
                    draw(that.curArr);
                    setTimeout(loop, that.animationInterval / that.animationSteps);
                }
            };

        // Draw method updates the canvas with the current display
        var draw = function (arr) {
            var numOfBars = arr.length;
            var barWidth;
            var barHeight;
            var border = 2;
            var ratio;
            var maxBarHeight;
            var gradient;
            var largestValue;
            var graphAreaX = 0;
            var graphAreaY = 0;
            var graphAreaWidth = that.width;
            var graphAreaHeight = that.height;
            var i;

            // Update the dimensions of the canvas only if they have changed
            if (context.canvas.width !== that.width ||
                context.canvas.height !== that.height) {
                context.canvas.width = that.width;
                context.canvas.height = that.height;
            }

            // draw the background color
            context.fillStyle = that.backroundColor;
            context.fillRect(0, 0, that.width, that.height);

            // if x axis labes exist, then make room
            if (that.xAxisLabelArr.length) {
                graphAreaHeight -= 40;
            }

            // calulate the dimensions of the bar
            barWidth = graphAreaWidth / numOfBars - that.margin * 2;
            maxBarHeight = graphAreaHeight - 25;

            // determine the largest value in the bar array
            var largestValue = 0;
            for (i = 0; i < arr.length; i++) {
                if (arr[i] > largestValue) {
                    largestValue = arr[i];
                }
            }

            // For each bar
            for (i = 0; i < arr.length; i++) {
                // set the ratio of curent bar compared to the maximum
                if (that.maxValue) {
                    ratio = arr[i] / that.maxValue;
                }
                else {
                    ratio = arr[i] / largestValue;
                }

                barHeight = ratio * maxBarHeight;

                // Turn on shadow
                context.shadowOffsetX = 2;
                context.shadowOffsetY = 2;
                context.shadowBlur = 2;
                context.shadowClor = '#999';

                // draw bar background
                context.fillStyle = '#333';
                context.fillRect(that.margin + i * that.width / numOfBars,
                    graphAreaHeight - barHeight,
                    barWidth,
                    barHeight);

                // turn off shadow
                context.shadowOffsetX = 0;
                context.shadowOffsetY = 0;
                context.shadowBlur = 0;

                // draw bar color if it is large enough to be visible 
                if (barHeight > border * 2) {
                    // create gradient
                    gradient = context.createLinearGradient(0, 0, 0, graphAreaHeight);

                    switch (true) {
                        case (Number(arr[i]) == 100):
                            gradient.addColorStop(1 - ratio, that.colors[8]);
                            break;
                        case (Number(arr[i]) > 90):
                            gradient.addColorStop(1 - ratio, that.colors[7]);
                            break;
                        case (Number(arr[i]) > 80):
                            gradient.addColorStop(1 - ratio, that.colors[6]);
                            break;
                        case (Number(arr[i]) > 65):
                            gradient.addColorStop(1 - ratio, that.colors[5]);
                            break;
                        case (Number(arr[i]) > 55):
                            gradient.addColorStop(1 - ratio, that.colors[4]);
                            break;
                        case (Number(arr[i]) > 40):
                            gradient.addColorStop(1 - ratio, that.colors[3]);
                            break;
                        case (Number(arr[i]) > 25):
                            gradient.addColorStop(1 - ratio, that.colors[2]);
                            break;
                        case (Number(arr[i]) > 10):
                            gradient.addColorStop(1 - ratio, that.colors[1]);
                            break;
                        default:
                            gradient.addColorStop(1 - ratio, that.colors[0]);
                            break;
                    }

                    gradient.addColorStop(1, '#ffffff');

                    context.fillStyle = gradient;
                    // fill rectangle with gradient
                    context.fillRect(that.margin + i * that.width / numOfBars + border,
                        graphAreaHeight - barHeight + border,
                        barWidth - border * 2,
                        barHeight - border * 2);
                }

                // wite bar value
                context.fillStyle = '#333';
                context.font = 'bold 12px sans-serif';
                context.textAlign = 'center';

                // use try catch in case of IE 8
                try {
                    context.fillText(parseInt(arr[i], 10) + '%',
                    i * that.width / numOfBars + (that.width / numOfBars) / 2,
                    graphAreaHeight - barHeight - 10);
                }
                catch (ex) { }

                // draw bar label if it exists
                if (that.xAxisLabelArr[i]) {
                    // use try catch in case of IE 8
                    context.fillStyle = '#333';
                    context.font = 'bold 12px sans-serif';
                    context.textAlign = 'center';

                    try {
                        var label = that.xAxisLabelArr[i];

                        if (that.xAxisLabelArr.length > 8) {
                            context.font = 'bold 10px sans-serif';
                        }

                        if (that.xAxisLabelArr.length > 11) {
                            context.font = 'bold 8px sans-serif';
                        }

                        if (that.xAxisLabelArr.length > 7) {
                            if (label.length > 6) {
                                label = label.slice(-8);
                            }
                        }

                        context.fillText(label,
                            i * that.width / numOfBars + (that.width / numOfBars) / 2,
                            that.height - 10);
                    }
                    catch (ex) { }
                }
            }
        };

        // Public properties and methods
        this.width = 300;
        this.height = 150;
        this.maxValue;
        this.margin = 5;
        this.colors = ['#FF0000', '#FF3300', '#FF9900', 'D1A319', '#CCCC00', '#99CC00', '#99CC00', '#669900', '#009900'];
        this.curArr = [];
        this.backroundColor = "rgb(215, 215, 215)";
        this.xAxisLabelArr = [];
        this.yAxisLabelArr = [];
        this.animationInterval = 100;
        this.animationSteps = 10;

        // Update method sets the end bar array and starts the animation
        this.update = function (newArr) {
            // if length of target and current array is different
            if (that.curArr.length !== newArr.length) {
                that.curArr = newArr;
                draw(newArr);
            }
            else {
                // set the starting array to the current array
                startArr = that.curArr;
                // set the target array to the new array
                endArr = newArr;
                // animation from the start array ot the end array
                if (!looping) {
                    loop();
                }
            }
        };
    }

    return {
        setXAxisLabels: setXAxisLabels,
        setGraphValues: setGraphValues,
        setMaxValue: setMaxValue
    }
}());