/**
 * @author Yuna
 *
 * using:
 * jQuery prototypal inheritance plugin boilerplate
 * Author: Alex Sexton, Scott Gonzalez
 * Further changes: @addyosmani
 * Licensed under the MIT license
 *
 *********************************************************************************************************************
 arrow-end		  string		arrowhead on the end of the path. The format for string is
                          type[-width[-length]].
                          Possible types: classic, block, open, oval, diamond, none,
                          width: wide, narrow, midium,
                          length: long, short, midium.
 cursor			    string		CSS type of the cursor
 fill			      string 		colour, gradient or image
 fill-opacity   number
 gap-point		  string		[\"top\",\"top_left\",\"top_right\",\"bottom\",\"bottom_left\",\"bottom_right\"]
                          or number	0 - 100, where 0 and 100 both mean \"top\" (@12 o'clock position), 50 is “bottom“ (@6pm),
                          25 is \"top_right\" (@3pm) etc.
  opacity			  number
  stroke			    string 		stroke colour
  stroke-dasharray		string 		[“”, “-”, “.”, “-.”, “-..”, “. ”, “- ”, “--”, “- .”, “--.”, “--..”]
  stroke-linecap		  string 		[“butt”, “square”, “round”]
  stroke-opacity		  number
  stroke-width		    number 		stroke width in pixels, default is '1'
  title 			        string 		will create tooltip with a given text
 **********************************************************************************************************************
 **/

(function($) {
    $.each(['show', 'hide'], function(i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function() {

            this.trigger(ev);
            el.apply(this, arguments);
        };
    });
})(jQuery);


;
(function($, window) {

    var allShapes = {};
    var break_point = {
        top: [0.0, 0.90, 0.10],
        top_left: [0.85, 0.75, 0.95],
        top_right: [0.10, 0.05, 0.20],
        bottom: [0.50, 0.40, 0.60],
        bottom_left: [0.65, 0.50, 0.70],
        bottom_right: [0.35, 0.25, 0.45]
    };

    var myObject = {
        init: function(options, elem) {
            // Mix in the passed-in options with the default options
            this.options = $.extend(true, {}, this.options, options);

            // Save the element reference, both as a jQuery
            // reference and a normal reference
            this.elem = elem;
            this.$elem = $(elem);

            // Build the DOM's initial structure
            this._build();

            // return this so that we can chain and use the bridge with less code.
            return this;
        },

        options: {
            traceCanvasPadding: 10,
            redrawSpeed: 3500,
            traceDivPref: "_wrap",
            traceCursor: 'pointer',
            traceOpt: {
                'stroke': 'green',
                'stroke-width': 2,
                'stroke-opacity': 1,
                'fill': 'none',
                'fill-opacity': 0,
                'gap-point': 'top_left',
                'zindex': 9999
            },
            isVisible: true,
            useRelativePositioning: false, // will position relative to the document by default
            onHide: function() {
                console.log("From hide Callback")
            },
            onEndTrace: function() {
                console.log("From end Trace Callback")
            },
            onClick: function(me) {
                //at this point you can get to the Raphael Element, for instance:
                //me.options.shape.animate({opacity: 0}, 1000, function(){ me.hideTrace(); });
                //for documentation go to http://raphaeljs.com/reference.html#Element.animate
                me.clickTrace();
            }
        },

        _build: function() {

            this.options.idToTrace = this.elem.id;
            this.options.wrapIdToTrace = this.elem.id + this.options.traceDivPref;

            if (this.options.isVisible === false) {
                allShapes[this.options.wrapIdToTrace] = {
                    trace: null,
                    isVisible: false,
                    origin: this.elem.id
                };

            } else {
                //in the future might need 2 offsets (for x and for y) for a more flaxible trace shape
                this.options.traceOffcet = this.options.traceCanvasPadding / 2;

                var context = this.options.useRelativePositioning ? this.$elem.offsetParent() : null;

                var canvasW = parseInt(this.$elem.outerWidth()) + this.options.traceCanvasPadding;
                var canvasH = parseInt(this.$elem.outerHeight()) + this.options.traceCanvasPadding;
                //.offset() gets position relative to document; .position();  is posision relative to a parent
                var position = this.$elem.offset();
                var left = parseInt(position.left);
                var top = parseInt(position.top);

                if (context) {
                    var marginTop = Number(this.$elem.css('margin-top').replace("px", "")) || 0;
                    var marginLeft = Number(this.$elem.css('margin-left').replace("px", "")) || 0;
                    var offset = this.$elem.position();
                    offset.top += marginTop + context.scrollTop();
                    offset.left += marginLeft;
                    top = offset.top;
                    left = offset.left;
                }


                if ((left - this.options.traceOffcet) > 0) {
                    left = left - this.options.traceOffcet;
                }

                if ((top - this.options.traceOffcet) > 0) {
                    top = top - this.options.traceOffcet;
                }

                //var body = context ? context : "body";
                var body = context ? context : this.$elem.parent();

                $("<div id='" + this.options.wrapIdToTrace + "'></div>").appendTo(body);
                $("#" + this.options.wrapIdToTrace).css({
                    "height": canvasH,
                    "width": canvasW,
                    "position": "absolute",
                    "z-index": this.options.traceOpt.zindex,
                    "top": top,
                    "left": left
                });

                this.drawTrace();

            }
            var me = this;
            this.traceitEvents(me);

        },

        drawTrace: function() {

            //create SVG inside wrapIdToTrace element
            var paper = new Raphael(this.options.wrapIdToTrace);
            var me = this;
            var shape = traceShape(paper, this.options.wrapIdToTrace, this.options.traceOffcet, this.options.redrawSpeed,
                this.options.traceOpt, function() {
                    if (me.options.onEndTrace != undefined)
                        me.options.onEndTrace();
                    allShapes[me.options.wrapIdToTrace].stable = true;
                });

            setShapeProperties(shape, this.options.wrapIdToTrace, this.options.onClick, me);
            //save instance
            this.options.shape = shape;
            allShapes[this.options.wrapIdToTrace] = {
                trace: this,
                isVisible: true,
                origin: this.elem.id
            };
        },

        reTrace: function(opt) {
            var me = this;

            if (typeof opt === "object") {
                this.options.traceOpt = $.extend({}, this.options.traceOpt, opt);
            }

            //if reTrace is called on the ellement that was hidden by window resize
            //or retrace is forced for an existing shape
            if ($("#" + this.options.wrapIdToTrace).length !== 0) {

                if (this.options.shape !== null && allShapes[this.options.wrapIdToTrace].stable == true) {

                    $("#" + this.options.wrapIdToTrace).show();
                    allShapes[this.options.wrapIdToTrace].stable = false;

                    if( this.options.traceOpt.redrawSpeed != undefined ) {
                      this.options.redrawSpeed = this.options.traceOpt.redrawSpeed;
                    }

                    if( this.options.traceOpt.traceCanvasPadding != undefined ) {
                      this.options.traceCanvasPadding = this.options.traceOpt.traceCanvasPadding;
                    }

                    if( this.options.traceOpt.traceCursor != undefined ){
                      this.options.traceCursor = this.options.traceOpt.traceCursor;
                    }
                    var newShape = animateProgressiveDrawing({
                            guidePath: this.options.shape
                        }, this.options.redrawSpeed, this.options.traceOpt,
                        function() {
                            if (me.options.onEndTrace != undefined)
                                me.options.onEndTrace();
                            allShapes[me.options.wrapIdToTrace].stable = true;
                        });

                    //do we want to give them an option to reset onClick function at reTrace????
                    setShapeProperties(newShape, this.options.wrapIdToTrace, this.options.onClick, me);

                    this.options.shape = newShape;
                    allShapes[this.options.wrapIdToTrace].isVisible = true;
                }
            } else {

                this.options.isVisible = true;

                if( this.options.traceOpt.redrawSpeed != undefined ) {
                  this.options.redrawSpeed = this.options.traceOpt.redrawSpeed;
                }

                if( this.options.traceOpt.traceCanvasPadding != undefined ) {
                  this.options.traceCanvasPadding = this.options.traceOpt.traceCanvasPadding;
                }

                if( this.options.traceOpt.traceCursor != undefined ){
                  this.options.traceCursor = this.options.traceOpt.traceCursor;
                }

                this._build();
            }
        },

        hideTrace: function() {
            this.options.shape.hide();
            $("#" + this.options.wrapIdToTrace).hide();
            allShapes[this.options.wrapIdToTrace].isVisible = false;

            if (this.options.onHide != undefined) this.options.onHide(this.options.shape);
        },

        showTrace: function() {
            this.reTrace();
        },


        clickTrace: function() {
            //default "click the trace" functionality
            var that = this;
            this.options.shape.animate({
                opacity: 0
            }, 1000, function() {
                that.hideTrace();
            });

        },

        traceitEvents: function(me) {

            this.$elem.bind('hide.trace', function(event) {
                if (me.options.shape !== undefined) {
                    me.hideTrace();
                }
            });

            this.$elem.bind('adjust.trace', function(event) {
                if (event.adjustments && typeof event.adjustments === 'object') {
                    me.reTrace(event.adjustments);
                } else {
                    me.reTrace();
                }
            });

            this.$elem.bind('show.trace', function(event) {
                me.showTrace();
            });

            this.$elem.bind('click.trace', function(event) {
                if (me.options.shape !== undefined) {
                    me.options.shape.click(me.options.shape.node.onclick());
                }

            });

            this.$elem.bind('delete.trace', function(event) {
                if (me.options.shape !== undefined) {
                    console.log(me.options, me.options.wrapIdToTrace);
                    //me.options.shape.hide().remove();
                    //$("#" + me.options.wrapIdToTrace).hide().remove();
                    me.options.shape.remove();
                    $("#" + me.options.wrapIdToTrace).remove();
                }
                // remove from allShapes array :
                delete allShapes[me.options.wrapIdToTrace];
                me.$elem.removeData("trace");

            });

        },

        click: function() {
            if (this.options.shape !== undefined) {
                this.options.shape.click(this.options.shape.node.onclick());
            }
        }
    };

    function setShapeProperties(carluka, id, callback, me) {
        var thisShape = carluka;

        thisShape.data("name", id);
        thisShape.node.onmouseover = function() {
            this.style.cursor = me.options.traceCursor; //'pointer'
        };

        thisShape.node.onclick = function() {
            if (callback != undefined) callback(me);
        };
    }

    //for version 0.1 of the plugin we are going to have just one 'type' of SVG shape:
    //an ellipse like path with an opening at the "gap-point" location.
    //example: 'gap-point' : 'top_left' The trace will start at point 1 (@85% of ellipse length)
    //continue to point 2 (@75%), then path will get interupted and connect with point3 at 95% of a slightly larger ellipse.
    //If traceit plugin takes off we can then add other shapes/animations.
    function traceShape(paper, wrapper_element_id, canvasPadding, speed, opt, callback) {
        //get the element we are going to trace
        var wrapper_element = $("#" + wrapper_element_id);
        var padding = 0;
        var padding2 = 0;

        if (canvasPadding !== 0) {
            padding = padding2 = canvasPadding / 2;
        }

        //find top coner of the traced element
        var xv = canvasPadding;
        var yv = canvasPadding;
        var width = parseInt(wrapper_element.outerWidth());
        var height = parseInt(wrapper_element.outerHeight());

        var rx = (width - canvasPadding * 2) / 2;
        var ry = (height - canvasPadding * 2) / 2;
        var xc = xv + rx;
        var yc = yv + ry;

        var rx_outer = rx;
        var ry_outer = ry + canvasPadding;
        var rx_inner = rx;
        var ry_inner = ry - canvasPadding;

        var ellips = paper.ellipse(xc, yc, rx_inner, ry_inner).attr({
            'stroke': "none",
            'fill': "none"
        });
        var ellips2 = paper.ellipse(xc, yc, rx_outer, ry_outer).attr({
            'stroke': "none",
            'fill': "none"
        });

        var percent, percent2, percent3;
        var location = opt["gap-point"];
        //validate break point location
        if (typeof location != "string" && typeof location != "number") {
            console.log("Bad location value: " + location + " please specify value between 0% and 100%. Switching to default location 85%.");
            location = 'top_left';
        }

        if (typeof location === "string") {
            if (break_point[location] == undefined) location = 'top_left';
            percent = break_point[location][0];
            percent2 = break_point[location][1];
            percent3 = break_point[location][2];
        } else {
            if (typeof location === "number") {
                percent = location / 100;
                if (percent > 1.0) {
                    percent = 0.85;
                    console.log("Bad location value: " + location + " please specify value between 0% and 100%. Switching to default location 85%.");
                }

                percent2 = percent - 0.10;
                if (percent2 < 0) {
                    percent2 = 1.0 - percent2;
                }
                percent3 = percent + 0.10;
                if (percent3 > 1.0) {
                    percent3 = percent3 - 1.0;
                }
            }
        }

        var len = ellips.getTotalLength();
        var len2 = ellips2.getTotalLength();
        var point1 = ellips.getPointAtLength(percent * len);
        var point2 = ellips.getPointAtLength(percent2 * len);
        var point3 = ellips2.getPointAtLength(percent3 * len2);

        ellips.remove();
        ellips2.remove();

        //combine the SVG path string
        var p = "M " + point1.x + ", " + point1.y + " A " + rx_inner + " " + ry_inner + " 0 1 1 " + point2.x + ", " + point2.y + " A " + rx_outer + " " + ry_outer + " 0 0 1 " + point3.x + ", " + point3.y;
        //draw the shape
        var carluka = animateProgressiveDrawing({
            canvas: paper,
            pathstr: p
        }, speed, opt, callback);

        return carluka;
    }

    function animateProgressiveDrawing(drawingCnfg, duration, attr, callback) {
        var canvas, pathstr;
        var guidePath = drawingCnfg.guidePath;

        if (guidePath === undefined) {
            canvas = drawingCnfg.canvas;
            pathstr = drawingCnfg.pathstr;
            guidePath = canvas.path(pathstr).attr({
                stroke: "none",
                fill: "none"
            });

        } else {
            canvas = guidePath.paper;
            guidePath.attr({
                stroke: "none",
                fill: "none"
            });
        }


        var path = canvas.path(guidePath.getSubpath(0, 1)).attr(attr);

        return progressiveDrawing(guidePath, path, duration, attr, callback);
    }


    function progressiveDrawing(guidePath, path, duration, attr, callback) {

        var totalLength = guidePath.getTotalLength(guidePath);
        var startTime = new Date().getTime();
        var intervalLength = 50;
        var result = path;

        var intervalID = setInterval(function() {

            var elapsedTime = new Date().getTime() - startTime;
            var thisLength = elapsedTime / duration * totalLength;
            var subpathstr = guidePath.getSubpath(0, thisLength);
            attr.path = subpathstr;
            path.animate(attr, intervalLength);

            if (elapsedTime >= duration) {
                clearInterval(intervalID);
                if (callback != undefined)
                    callback();
                guidePath.remove();
            }
        }, intervalLength);

        return result;
    }

    //Pressing the escape key will redraw all the traces
    $(document).bind('keyup.trace', function(event) {
        if (event.keyCode === 27) {
            $.each(allShapes, function(index, object) {
                if (allShapes[index].isVisible === true) {
                    object.trace.reTrace();
                }
            });
        }
    });

    //Resizing a window will redraw all the traces
    $(window).resize(function() {
        //remove trace div DOM element
        $.each(allShapes, function(index, object) {
            $("#" + index).remove();
        });
        if (this.resizeTO) {
            clearTimeout(this.resizeTO);
        }
        this.resizeTO = setTimeout(function() {
            $(this).trigger('resizeEnd');
        }, 800);
    });

    $(window).bind('resizeEnd', function() {
        //redraw, if window hasn't changed size in 800ms
        $.each(allShapes, function(index, object) {
            //id of an element we are tracing
            if (allShapes[index].isVisible === true) {

                if ($("#" + allShapes[index].origin).is(':visible')) {
                    object.trace.reTrace();
                } else {
                    //hide the trace
                    object.trace.hideTrace();
                }
            }
        });
    });


    // Object.create support test, and fallback for browsers without it
    if (typeof Object.create !== 'function') {
        Object.create = function(o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }


    // Create a plugin based on a defined object
    $.traceit = function(name, object) {
        $.fn[name] = function(options) {
            return this.each(function() {
                if (!$.data(this, name)) {
                    $.data(this, name, Object.create(object).init(
                        options, this));
                }
            });
        };
    };


    //
    $.traceit('trace', myObject);

    // Usage:
    // $('#elem').myobj({name: "John"});
    // var inst = $('#elem').data('myobj');
    // inst.myMethod('I am a method');
    // $("#elem").trigger("myEvent");

}($, window));
