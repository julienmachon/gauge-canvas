'use strict';
/*global q4: true */

window.q4 = window.q4 || {};

(function() {
    /**
     *
     * @param canvas the canvas object to draw in
     * @constructor
     */
    q4.Widget = function(canvas){
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this._context.save();
    };

    /**
     * Start bottom left, finish bottom right, gradient background
     * @param canvas
     * @param max
     * @constructor
     */
    q4.GaugeWidget = function(canvas, _max) {
        //Super constructor
        q4.Widget.call(this, canvas);

        var max = _max; //The max value of the widget
        var minAngle = 0.8; //Start coefficient
        var midAngle = 1.5; //needed to calculate the slope (y2 - y1) / (x2 - x1)

        //Private function. Calculates radius coefficient
        function getCoefficient(value) {
            //Basic line equation y=mx+b
            //where m is the slope and b the y-intercept
            return (midAngle - minAngle)/(max/2)*value+minAngle;
        }

        //Private function. Gets percentage
        function getPercent(value) {
            return Math.round((value*100)/max);
        }

        /**
         *
         * @param value
         */
        this.draw = function(value) {
            //clear whatever is on canvas
            this._context.clearRect(0,0, this._canvas.width, this._canvas.height);

            var x = this._canvas.width / 2;
            var y = this._canvas.height / 2;

            //ARC
            var radius = 60;
            var startAngle = minAngle * Math.PI;
            var endAngle = getCoefficient(value) * Math.PI;
            var counterClockwise = false;
            var gradient = this._context.createLinearGradient(0,0,150,0);
            gradient.addColorStop(0, 'green');
            gradient.addColorStop(0.5, 'orange');
            gradient.addColorStop(1, 'red');

            this._context.beginPath();
            this._context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
            this._context.lineWidth = 12;
            this._context.shadowBlur = 5;
            this._context.shadowColor = 'black';

            this._context.strokeStyle = gradient;
            this._context.stroke();

            //TEXT
            //reset
            this._context.shadowBlur = 0;

            this._context.font = '20pt Calibri';
            this._context.textAlign = 'center';
            this._context.fillText(getPercent(value)+'%', x, y);
            this._context.font = '14pt Calibri';
            this._context.fillText(value, x, y+50);

        };

        q4.GaugeWidget.prototype = new q4.Widget(canvas);
    };

    /**
     *
     * @param canvas
     * @param _max
     * @constructor
     */
    q4.LoadingCircleWidget = function(canvas, _max) {
        //Super constructor
        q4.Widget.call(this, canvas);

        var max = _max; //The max value of the widget
        var minAngle = 1.5; //Start coefficient
        var midAngle = 2.5; //needed to calculate the slope (y2 - y1) / (x2 - x1)

        //Private function. Calculates radius coefficient
        function getCoefficient(value) {
            //Basic line equation y=mx+b
            //where m is the slope and b the y-intercept
            return (midAngle - minAngle)/(max/2)*value+minAngle;
        }

        //Private function. Gets percentage
        function getPercent(value) {
            return Math.round((value*100)/max);
        }

        /**
         *
         * @param value
         */
        this.draw = function(value) {
            //clear whatever is on canvas
            this._context.clearRect(0,0, this._canvas.width, this._canvas.height);

            var x = this._canvas.width / 2;
            var y = this._canvas.height / 2;

            //console.log(getCoefficient(value));
            //ARC
            var radius = 60;
            var startAngle = minAngle * Math.PI;
            var endAngle = getCoefficient(value) * Math.PI;
            var counterClockwise = false;

            this._context.beginPath();
            this._context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
            this._context.lineWidth = 12;
            this._context.shadowBlur = 5;
            this._context.shadowColor = 'black';

            this._context.strokeStyle = '#006699';
//      this._context.strokeStyle = '#993366';
            this._context.stroke();

            //TEXT
            //reset
            this._context.shadowBlur = 0;
            this._context.fillStyle = '#363636';
            this._context.font = '20pt Calibri';
            this._context.textAlign = 'center';
            this._context.fillText(getPercent(value)+'%', x, y+10);

        };

        q4.GaugeWidget.prototype = new q4.Widget(canvas);
    };

})();
