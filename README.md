traceit.js
=======


traceit.js is a jQuery plugin based on raphael.js that allows you dynamically trace page elements.
It was written using jQuery prototypal inheritance plugin boilerplate Authors: Alex Sexton & Scott Gonzalez.

traceit.js adds a dynamic trace to any element on a page; configure its stroke width, animation speed, stroke/fill color and opacity as well as hideCallback, endTraceCallback and onClick callback functions.

Trace size adapts to contents. 

Examples
--------

[traceit.js examples](http://valleybazaar.org/index.html#tracebox)

Usage:
------

```JavaScript
$('#elem').trace();
var inst = $('#elem').data('trace');
inst.myMethod();
$("#elem").trigger("myEvent");
```	

What can I configure? All options are optional. Here are the default options. You can overwrite each and every one of them. The ```trace``` constructor accepts the following options object.

```JavaScript
options: {
		    trace_canvas_padding: 10,
		    redrawspeed: 3500,
		    trace_div_pref: "_wrap",
		    trace_cursor: 'pointer',
		    trace_opt: { 'stroke': 'yellow', 'stroke-width': 5, 
		    		 'stroke-opacity': 1, 'fill': 'none', 							 				 'fill-opacity': 0, 'zindex': 9999},
		    isVisible: true,
		    useRelativePositioning : false, // will position relative to the document by default
		    hideCallback: function() { console.log("From hide Callback") },
		    endTraceCallback: function() { console.log("From end Trace Callback") },
		    onClick: function(me){ me.options.shape.animate({opacity: 0}, 1000, function(){ me.HideTrace(); }); }		
		  }
```


Can I have callbacks? Sure. 

```JavaScript
$('#elem').trace({  
	onClick : function(){ console.log('triggered when user clicks on a trace shape.'); }, 
	hideCallback : function(){ console.log('triggered when hide animation completes.'); },
	endTraceCallback: function() { console.log("triggered when trace animation completes."); },
});

```

Author
------
Yuna Portnoy / [valleybazaar.org](http://valleybazaar.org/)

Licence
-------

Do what you like, give credit when you can.
