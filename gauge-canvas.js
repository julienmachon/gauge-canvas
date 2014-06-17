'use strict';
/*global q4: true */

/**
 * TODO:
 *      Need to add parameters for colour, width, etc...
 *      Write unit test
 *      Add to Bower
 */

window.gaugeCanvas = window.gaugeCanvas || {};

(function() {
    /**
     * Generic constructor for a widget
     *
     * @param canvas, the canvas to draw in
     * @param settings, optional object to specify colours, font, etc...
     * @constructor
     */
    gaugeCanvas.Widget = function(canvas, settings){
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this._context.save();

        var lol = 1;

        this._settings = {};
        if(settings) {
            this._settings = settings;
        }

        //Getter functions
        this.getCanvas = function() {
            return this._canvas;
        }

        this.getContext = function() {
            return this._context;
        }

        this.getSettings = function() {
            return this._settings;
        }
    };

    /**
     * Generic constructor for a circle widget
     *
     * @param canvas, the canvas to draw in
     * @param settings, optional object to specify colours, font, etc...
     * @constructor Generic constructor for a widget
     */
    gaugeCanvas.CircleWidget = function(_canvas, _settings){

        //build up settings
        var settings = _settings || {};
        settings.max = settings.max ? settings.max : 100;//The max value of the widget
        settings.minAngle = settings.minAngle ? settings. minAngle : 1.5; //Start coefficient
        settings.midAngle = settings.midAngle ? settings.midAngle : 2.5; //needed to calculate the slope (y2 - y1) / (x2 - x1)

        //Super constructor
        gaugeCanvas.Widget.call(this, _canvas, settings);

//        var settings = this.getSettings(),
//            max = settings.max ? settings.max : 100,//The max value of the widget
//            minAngle = settings.minAngle ? settings. minAngle : 1.5, //Start coefficient
//            midAngle = settings.midAngle ? settings.midAngle : 2.5; //needed to calculate the slope (y2 - y1) / (x2 - x1)

        //Calculates radius coefficient
        this.getCoefficient = function(value) {
            //Basic line equation y=mx+b
            //where m is the slope and b the y-intercept
            return (settings.midAngle - settings.minAngle)/(settings.max/2)*value+settings.minAngle;
        };

        //Gets percentage
        this.getPercent = function(value) {
            return Math.round((value*100)/settings.max);
        };

        gaugeCanvas.CircleWidget.prototype = new gaugeCanvas.Widget(_canvas);

    };

    /**
     * Start bottom left, finish bottom right, gradient background
     * @param canvas
     * @param max
     * @constructor
     */
    gaugeCanvas.GaugeWidget = function(_canvas, _settings) {

        var settings = _settings,
            canvas = _canvas,
            context;

        //build up settings
        settings.max = _settings.max ? _settings.max : 100; //The max value of the widget
        settings.minAngle = 0.8;
        settings.midAngle = 1.5;

        //Super constructor
        gaugeCanvas.CircleWidget.call(this, _canvas, settings);

        context = this.getContext(),
            settings = this.getSettings();

        /**
         *
         * @param value
         */
        this.draw = function(value) {
            //clear whatever is on canvas
            context.clearRect(0,0, canvas.width, canvas.height);

            var x = canvas.width / 2;
            var y = canvas.height / 2;

            //ARC
            var radius = 60;
            var startAngle = settings.minAngle * Math.PI;
            var endAngle = this.getCoefficient(value) * Math.PI;
            var counterClockwise = false;
            var gradient = context.createLinearGradient(0,0,150,0);
            gradient.addColorStop(0, 'green');
            gradient.addColorStop(0.5, 'orange');
            gradient.addColorStop(1, 'red');

            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
            context.lineWidth = 12;
            context.shadowBlur = 5;
            context.shadowColor = 'black';

            context.strokeStyle = gradient;
            context.stroke();

            //TEXT
            //reset
            context.shadowBlur = 0;

            context.font = '20pt Calibri';
            context.textAlign = 'center';
            context.fillText(this.getPercent(value)+'%', x, y);
            context.font = '14pt Calibri';
            context.fillText(value, x, y+50);

        };

        gaugeCanvas.GaugeWidget.prototype = new gaugeCanvas.CircleWidget(canvas);
    };

    /**
     *
     * @param canvas
     * @param _max
     * @constructor
     */
    gaugeCanvas.LoadingCircleWidget = function(_canvas, _settings) {

        var settings = _settings,
            canvas = _canvas,
            context;

        //Super constructor
        gaugeCanvas.CircleWidget.call(this, _canvas, settings);

        context = this.getContext();
        settings = this.getSettings();


        /**
         *
         * @param value
         */
        this.draw = function(value) {
            //clear whatever is on canvas
            context.clearRect(0,0, canvas.width, canvas.height);

            var x = canvas.width / 2;
            var y = canvas.height / 2;

            //ARC
            var radius = 60;
            var startAngle = settings.minAngle * Math.PI;
            var endAngle = this.getCoefficient(value) * Math.PI;
            var counterClockwise = false;

            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
            context.lineWidth = 12;
            context.shadowBlur = 5;
            context.shadowColor = 'black';

            context.strokeStyle = '#006699';
//      this._context.strokeStyle = '#993366';
            context.stroke();

            //TEXT
            //reset
            context.shadowBlur = 0;
            context.fillStyle = '#363636';
            context.font = '20pt Calibri';
            context.textAlign = 'center';
            context.fillText(this.getPercent(value)+'%', x, y+10);

        };

        gaugeCanvas.GaugeWidget.prototype = new gaugeCanvas.CircleWidget(canvas);
    };

})();
