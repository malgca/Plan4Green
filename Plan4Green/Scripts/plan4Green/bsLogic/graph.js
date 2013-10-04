/* Full credit to William Malone
http://www.williammalone.com/articles/html5-canvas-javascript-bar-graph/
*/
var graph = (function () {
    var context = document.getElementById("graph-canvas").getContext("2d");

    var barGraph = new BarGraph(context);
    barGraph.margin = 2;

    // set an array for the x axis labels
    this.setXAxisLabels = function (xAxisArray) {
        barGraph.xAxisLabelArr = xAxisArray;
    }

    // set the graph values to be displayed
    this.setGraphValues = function (valueArray) {
        barGraph.update(valueArray);
    }

    // draws the coloured bar graph onto the screen
    function BarGraph(context) {
        // Private properties and methods
        var
            that = this,
            startArr,
            endArr,
        // Draw method updates the canvas with the current display
        draw = function (arr) {
            var numOfBars = arr.length;
            var barWidth;
            var barHeight;
            var border = 5;
            var ratio;
            var maxBarHeight;
            var gradient;
            var largestValue;
            var graphAreaX = 10;
            var graphAreaY = 10;
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
                graphAreaHeight -= 50;
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

                    gradient.addColorStop(0, '#7acf00');
                    gradient.addColorStop(1, '#C0C0C0');

                    context.fillStyle = gradient;
                    // fill rectangle with gradient
                    context.fillRect(that.margin + i * that.width / numOfBars + border,
                        graphAreaHeight - barHeight + border,
                        barWidth - border * 2,
                        barHeight - border * 2);
                }

                // wite bar value
                context.fillStyle = '#333';
                context.font = 'bold 16px sans-serif';
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
                    context.font = 'bold 14px sans-serif';
                    context.textAlign = 'center';

                    try {
                        var label = that.xAxisLabelArr[i];

                        if (that.xAxisLabelArr.length > 3) {
                            if (label.length > 6) {
                                label = label.slice(-10);
                            }
                        }

                        context.fillText(label,
                            i * that.width / numOfBars + (that.width / numOfBars) / 2,
                            that.height - 25);
                    }
                    catch (ex) { }
                }
            }
        };

        // Public properties and methods
        this.width = screen.width * 85 / 100;
        this.height = screen.height * 85 / 100;
        this.maxValue = 100;
        this.margin = 5;
        this.curArr = [];
        this.backroundColor = "rgb(215, 215, 215)";
        this.xAxisLabelArr = [];
        this.yAxisLabelArr = [];
        this.animationInterval = 100;
        this.animationSteps = 10;

        // Update method sets the end bar array and starts the animation
        this.update = function (newArr) {
            that.curArr = newArr;
            draw(newArr);
        };
    }

    return {
        setXAxisLabels: setXAxisLabels,
        setGraphValues: setGraphValues,
    }
}());