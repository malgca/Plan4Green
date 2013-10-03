/* adapted from graph by William Malone
http://www.williammalone.com/articles/html5-canvas-javascript-bar-graph/
*/
var bsStoplight = (function () {
    // draws the coloured bar graph onto the screen
    function BarGraph(context) {
        // Private properties and methods
        var
            that = this,
            startValue,
            endValue,
            looping = false,

            // loop methods adjusts the height of bar and redraws is necessary
            loop = function () {
                var delta;
                var animationComplete = true;

                // boolean to prevent update function from looping if already looping
                looping = true;

                // change the current bar height toward it's target height
                delta = (endValue - startValue) / that.animationSteps;
                that.curValue += delta;

                // if any change is made then flip a switch
                if (delta) {
                    animationComplete = false;
                }

                // if no change was made to any bars then we are done
                if (animationComplete) {
                    looping = false;
                }
                else {
                    // draw and call loop again
                    draw(that.curValue);
                    setTimeout(loop, that.animationInterval / that.animationSteps);
                }
            };

        // Draw method updates the canvas with the current display
        var draw = function (value) {
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

            // calulate the dimensions of the bar
            barWidth = graphAreaWidth - that.margin * 2;
            maxBarHeight = graphAreaHeight;

            var largestValue = value;
            // set the ratio of current bar compared to the maximum
            if (that.maxValue) {
                ratio = value / that.maxValue;
            }
            else {
                ratio = value / largestValue;
            }
            barHeight = ratio * maxBarHeight;

            // Turn on shadow
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowBlur = 2;
            context.shadowClor = '#999';

            // draw bar background
            context.fillStyle = '#333';
            context.fillRect(that.margin + i * that.width,
                graphAreaHeight - barHeight,
                barWidth,
                barHeight);

            // turn off shadow
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;

            // create gradient
            gradient = context.createLinearGradient(0, 0, 0, graphAreaHeight);

            gradient.addColorStop(0, that.colors[8]);
            gradient.addColorStop(1, '#ffffff');

            context.fillStyle = gradient;
            // fill rectangle with gradient
            context.fillRect(that.margin + i * that.width + border,
                graphAreaHeight - barHeight + border,
                barWidth - border * 2,
                barHeight - border * 2);


            // wite bar value
            context.fillStyle = '#333';
            context.font = 'bold 12px sans-serif';
            context.textAlign = 'center';

            // use try catch in case of IE 8
            try {
                context.fillText(parseInt(value, 10) + '%',
                i * that.width + (that.width) / 2,
                graphAreaHeight - barHeight - 10);
            }
            catch (ex) { }
        };

        // Public properties and methods
        this.width = 300;
        this.height = 15;
        this.maxValue = 100;
        this.margin = 0;
        this.colors = ['#FF0000', '#FF3300', '#FF9900', 'D1A319', '#CCCC00', '#99CC00', '#99CC00', '#669900', '#009900']; this.backroundColor = "rgb(215, 215, 215)";
        this.yAxisLabelArr = [];
        this.curValue = 50;
        this.animationInterval = 100;
        this.animationSteps = 10;

        // Update method sets the end bar array and starts the animation
        this.update = function (newValue) {
            // set the starting array to the current array
            startValue = that.curValue;
            // set the target array to the new array
            endValue = newValue;
            // animation from the start array ot the end array
            if (!looping) {
                loop();
            }
        };
    }

    // draws the stoplight on an already existing canvas
    var draw = function (bsItem, div) {
        if (bsItem.type == 'perspective') {
            var stopCanvas = div.childNodes[1].children[1].children[0];
            stopCanvas.height = 10;
        }
        else {
            var stopCanvas = div.childNodes[1].children[3].children[0];
            stopCanvas.height = 15;
        }

        var context = stopCanvas.getContext("2d");

        var barGraph = new BarGraph(context);
        barGraph.margin = 0;

        if (bsItem.type == 'perspective') {
            barGraph.height = 10;
        }
        else {
            barGraph.height = 15;
        }

        barGraph.update(Math.random() * 50)
    }

    return {
        draw: draw
    }
}());