/**
 * @author Yuna
 * 
 * using: 
 * jQuery prototypal inheritance plugin boilerplate
 * Author: Alex Sexton, Scott Gonzalez
 * Further changes: @addyosmani
 * Licensed under the MIT license
 */


(function ($) {
  $.each(['show', 'hide'], function (i, ev) {
    var el = $.fn[ev];
    $.fn[ev] = function () {
    	
      this.trigger(ev);
      el.apply(this, arguments);
    };
  });
})(jQuery);


;(function($, window){
	
		var all_shapes = {};
		
		var myObject = {
		  init: function( options, elem ) {
		    // Mix in the passed-in options with the default options
		    this.options = $.extend( {}, this.options, options );
		
		    // Save the element reference, both as a jQuery
		    // reference and a normal reference
		    this.elem  = elem;
		    this.$elem = $(elem);
		
		    // Build the DOM's initial structure
		    this._build();
		
		    // return this so that we can chain and use the bridge with less code.
		    return this;
		  },
		  
		  options: {
		    trace_canvas_padding: 10,
		    redrawspeed: 3500,
		    trace_div_pref: "_wrap",
		    trace_cursor: 'pointer',
		    trace_opt: { 'stroke': 'yellow', 'stroke-width': 5, 'stroke-opacity': 1, 'fill': 'none', 'fill-opacity': 0, 'zindex': 9999},
		    isVisible: true,
		    useRelativePositioning : false, // will position relative to the document by default
		    hideCallback: function() { console.log("From hide Callback") },
		    endTraceCallback: function() { console.log("From end Trace Callback") },
		    onClick: function(me) { me.ClickTrace(); /*me.options.shape.animate({opacity: 0}, 1000, function(){ me.HideTrace(); }); */ },		
		  },
		  
		  _build: function(){
		  
		    this.options.id_to_trace = this.elem.id;
		    this.options.wrap_id_to_trace = this.elem.id  + this.options.trace_div_pref;
		    this.options.trace_offcet = this.options.trace_canvas_padding/2;  //might need 2 offsets for x and for y
		 	
		 	var context = this.options.useRelativePositioning ? this.$elem.offsetParent() : null;
					
		    var canvas_w = parseInt(this.$elem.outerWidth()) + this.options.trace_canvas_padding;  
		 	var canvas_h = parseInt(this.$elem.outerHeight()) + this.options.trace_canvas_padding; 
		    var position = this.$elem.offset();  // .offset() gets position relative to document; .position();  is posision relative to a parent
			var left = parseInt(position.left);
			var top = parseInt(position.top);
			
			if( context ) {
				var marginTop = Number(this.$elem.css('margin-top').replace("px", "")) || 0;
				var marginLeft = Number(this.$elem.css('margin-left').replace("px", "")) || 0;
				var offset = this.$elem.position();
					offset.top += marginTop + context.scrollTop(); 
					offset.left += marginLeft;
				top = offset.top;
				left = offset.left;
			}
			
				 	
		    if( (left - this.options.trace_offcet) > 0 ){
		    	left = left - this.options.trace_offcet;
		    }  
		    	  
		    if( (top - this.options.trace_offcet) > 0 ){
		    	top = top - this.options.trace_offcet;
		    }	    
		     
		    //should this go into a body container instead???? do we want to appened html if it is not there?   		
		 	//$('#canvas_container').append("<div id='" + this.options.wrap_id_to_trace + "'></div>");
		 	//var body = context ? context : "body";
		 	var body = context ? context : this.$elem.parent();
		 
		 	$("<div id='" + this.options.wrap_id_to_trace + "'></div>").appendTo( body );
		    $("#" + this.options.wrap_id_to_trace).css({
		 		"height": canvas_h,
		 		"width": canvas_w,
		 		"position": "absolute", 
		 		"z-index" : this.options.trace_opt.zindex,
		 		"top" : top, 
		 		"left": left
		 		}); 
		 					
		 	if( this.options.isVisible === true ){
		 		this.drawTrace();
		 	} 
		 	else {
		 		all_shapes[this.options.wrap_id_to_trace] = {trace: null, isVisible : false, origin: this.elem.id};
		 	}
		 	
		 	var me = this;
		 	this.traceitEvents( me );
			
		  },
		  
		  drawTrace: function () {
				
				//create SVG inside wrap_id_to_trace element
		 		var paper = new Raphael(this.options.wrap_id_to_trace);   		  
		    	var me = this;	
		    	var shape = traceShape( paper, this.options.id_to_trace, this.options.trace_offcet, this.options.redrawspeed, 
		    							this.options.trace_opt, function(){ if( me.options.endTraceCallback != undefined ) 
		    																	me.options.endTraceCallback(); 
		    																all_shapes[me.options.wrap_id_to_trace].stable = true; 
		    															  });
		    							
		    	set_shape_properties( shape, this.options.wrap_id_to_trace, this.options.onClick, me ); 
		  		//save instance
		  		this.options.shape = shape;
		  		all_shapes[this.options.wrap_id_to_trace] = {trace: this, isVisible : true, origin: this.elem.id };
			},
			
		  reTrace : function ( opt ) {
		  	var me = this;
		  	var trace_options = this.options.trace_opt;
		  	if( typeof opt === "object") {
		  		 trace_options = $.extend( {}, this.options.trace_opt, opt );
		  	}
		  	
		  	if( $("#" + this.options.wrap_id_to_trace).length !== 0 ) {
		  		
		  		if( this.options.shape !== null  && all_shapes[this.options.wrap_id_to_trace].stable == true ){
		  			
		  			$("#" + this.options.wrap_id_to_trace).show();
		  			all_shapes[this.options.wrap_id_to_trace].stable = false;
		  			
		   			var new_shape = animate_progressive_drawing( { guide_path: this.options.shape}, this.options.redrawspeed, trace_options, 
		    														function(){ if( me.options.endTraceCallback != undefined ) 
						    														me.options.endTraceCallback(); 
						    													all_shapes[me.options.wrap_id_to_trace].stable = true; 
						    											  	});	
						    											  									  
		    		//do we want to give them an option to reset onClick function at reTrace????
		  			set_shape_properties( new_shape, this.options.wrap_id_to_trace, this.options.onClick, me ); 
		  			
		  			this.options.shape = new_shape;
		  			all_shapes[this.options.wrap_id_to_trace].isVisible = true;
		  		}
		  	}
		  	else{ 		
		  			this.options.isVisible = true;
		  			this._build();
		  	}
		  },
		  
		  HideTrace: function() {  	
			  	this.options.shape.hide();
			  	$("#" + this.options.wrap_id_to_trace).hide();
			  	all_shapes[this.options.wrap_id_to_trace].isVisible = false;
			  	
			  	if( this.options.hideCallback != undefined ) this.options.hideCallback(this.options.shape);
		  },
		  
		  ShowTrace: function() {
		  		this.reTrace();
		  }, 
		  
		  
		  ClickTrace: function() {  
		  	//default "click the trace" functionality
		  	var that = this;
		  	this.options.shape.animate({opacity: 0}, 1000, function(){ that.HideTrace(); }); 
		 
		  },
		  
		  traceitEvents: function( me ) {
		  
				this.$elem.bind('hide.trace', function(event){
					console.log("In hide.....");
					me.HideTrace();
				});
							
				this.$elem.bind('adjust.trace',  function(event){			
					if(event.adjustments && typeof event.adjustments === 'object'){
							console.log("In adjust.trace 2.....");
							me.reTrace(event.adjustments);
					}
				});
							
				this.$elem.bind('show.trace',  function(event){
						me.ShowTrace();
				});
				
				this.$elem.bind('click.trace',  function(event){
						me.options.shape.click(me.options.shape.node.onclick());
				});
							
				this.$elem.bind('delete.trace',  function(event){
					this.options.shape.hide().remove();
					$("#" + this.options.wrap_id_to_trace).hide().remove();	
					// remove from all_shapes array :	
					all_shapes.splice(this.options.wrap_id_to_trace, 1);									
					this.$elem.removeData("trace");
				});
				
			},
		  
		  click: function() {
		  	this.options.shape.click(this.options.shape.node.onclick());
		  } 
		};
		
		function set_shape_properties( carluka, id, callback, me){
				var this_shape = carluka;
				
				this_shape.data("name", id);
				this_shape.node.onmouseover = function(){ this.style.cursor = 'pointer'; };
				this_shape.node.onclick = function(){  
					if ( callback != undefined ) callback(me);	
				};	
		}
		
		function traceShape(paper, id, canvas_padding, speed, opt, callback ){
				var d = $("#" + id);
				var padding = 0;
				var padding2 = 0;
				
				if( canvas_padding !== 0 ){
					padding = padding2 = canvas_padding/2;
				}
				
				var xv = canvas_padding; //top coner of the traced element 
				var yv = canvas_padding;
				var width = parseInt(d.outerWidth());
				var height = parseInt(d.outerHeight());
				
				var xc = xv + width/2;
				var yc = yv + height/2;
				var rx = (width - padding)/2;
				var ry = (height - padding)/2;
				var rx2 = rx; 
				var ry2 = ry + canvas_padding * 2;
				
				var ellips = paper.ellipse(xc, yc, rx, ry).attr( { 'stroke': "none", 'fill': "none" } );
				var ellips2 = paper.ellipse(xc, yc, rx2, ry2).attr( { 'stroke': "none", 'fill': "none" } );
				
				var percent = 0.85;
				var percent2 = 0.75;
				var percent3 = 0.95;
				var len = ellips.getTotalLength();
				var len2 = ellips2.getTotalLength();
			    var point1 = ellips.getPointAtLength(percent * len);
			    var point2 = ellips.getPointAtLength(percent2 * len);
			    var point3 = ellips2.getPointAtLength(percent3 * len2);
			      
			    ellips.remove(); 	
			    ellips2.remove(); 
		    	 
			    var p = "M "+ point1.x + ", "+ point1.y 
			    	+ " A "
			    	+ rx + " " + ry
			    	+ " 0 1 1 "	    	
			    	+ point2.x + ", " + point2.y
			    	+ " A "
			        + rx2 + " " + ry2
			        + " 0 0 1 "
			        + point3.x + ", " + point3.y;
			    
			    var carluka = animate_progressive_drawing( { canvas: paper, pathstr: p} , speed, opt, callback );
			        
			return carluka;
		}
		
		function animate_progressive_drawing( drawing_cnfg, duration, attr, callback ) {
			var canvas, pathstr;
			var guide_path = drawing_cnfg.guide_path;
			
			if( guide_path === undefined ) {
				canvas = drawing_cnfg.canvas;
			 	pathstr = drawing_cnfg.pathstr;
			 	guide_path = canvas.path( pathstr ).attr( { stroke: "none", fill: "none" } );
			 	
			}
		    else {
		    	canvas = guide_path.paper;
			    guide_path.attr( { stroke: "none", fill: "none" } );
		    }
		  
		
			var path = canvas.path( guide_path.getSubpath( 0, 1 ) ).attr( attr );
			
			return progressive_drawing( guide_path, path, duration, attr, callback );
		}
		
		
		function progressive_drawing( guide_path, path, duration, attr, callback) {
		    var total_length = guide_path.getTotalLength( guide_path );
		    var start_time = new Date().getTime();
		    var interval_length = 50;
		    var result = path;        
		 
		    var interval_id = setInterval( function()
		    {
		    	
		        var elapsed_time = new Date().getTime() - start_time;
		        var this_length = elapsed_time / duration * total_length;
		        var subpathstr = guide_path.getSubpath( 0, this_length );            
		        attr.path = subpathstr;
		        path.animate( attr, interval_length );
		        
		        if ( elapsed_time >= duration )
		        {
		            clearInterval( interval_id );
		            if ( callback != undefined ) 
		            	callback();
		            guide_path.remove();
		        }                                       
		    }, interval_length );  
		     
		    return result;
		}
		
		
		// Object.create support test, and fallback for browsers without it
		if ( typeof Object.create !== 'function' ) {
		    Object.create = function (o) {
		        function F() {}
		        F.prototype = o;
		        return new F();
		    };
		}
		
		
		// Create a plugin based on a defined object
		$.traceit = function( name, object ) {
		  $.fn[name] = function( options ) {
		    return this.each(function() {
		      if ( ! $.data( this, name ) ) {
		        $.data( this, name, Object.create(object).init( 
		        options, this ) );
		      }
		    });
		  };
		};
		
		$(document).bind('keyup.trace',function(event){ // Pressing the escape key will redraw all the traces
				if(event.keyCode === 27){
					$.each(all_shapes, function(index,object) {
						if( all_shapes[index].isVisible === true ){
							object.trace.reTrace();
						}
					});
				}
		});
		
		
		$(window).resize(function() {
			//rm_trace_div
		  	$.each(all_shapes, function(index,object){
					$("#" + index).remove();
			});
		    if(this.resizeTO) {
		    	clearTimeout(this.resizeTO);
		    }
			this.resizeTO = setTimeout(function() {$(this).trigger('resizeEnd');}, 800);
		});
		    
		$(window).bind('resizeEnd', function() {
		    //re draw, if window hasn't changed size in 800ms
		  	$.each(all_shapes, function(index,object){
		  		//id of an element we are tracing
					if( all_shapes[index].isVisible === true  ) {
						
						 if( $("#" + all_shapes[index].origin).is(':visible') ){
						 	object.trace.reTrace();
						 }
						else {
							//hide the trace
							object.trace.HideTrace();
						}	
					}
			});
		});
		
		
		// 
		$.traceit('trace', myObject);
		
		// Usage:
		// $('#elem').myobj({name: "John"});
		// var inst = $('#elem').data('myobj');
		// inst.myMethod('I am a method');
		// $("#elem").trigger("myEvent");

}($, window));