traceit.js
=======


**traceit.js** is a jQuery plugin based on raphael.js that allows you dynamically trace page elements.
It was written using jQuery prototypal inheritance plugin boilerplate Authors: Alex Sexton & Scott Gonzalez.

**traceit.js** adds a dynamic trace to any element on a page; configure its stroke width, animation speed, stroke/fill color and opacity as well as onHide, onEndTrace and onClick callback functions.

v 1.0 Trace size does not adapt to contents. 

Examples
--------

[traceit.js examples](http://valleybazaar.org/index.html#tracebox)

Usage:
------

```JavaScript
//Initialize a trace instance with:
$('#elem').trace();

//you can later refer to it by doing:
var inst = $('#elem').data('trace');
inst.myMethod();
$("#elem").trigger("myEvent");
```	

What can I configure? All options are optional. Here are the default options. You can overwrite each and every one of them. The ```trace``` constructor accepts the following options object.
```JavaScript
options: {
		    traceCanvasPadding: 10,
		    redrawSpeed: 3500,
		    traceDivPref: "_wrap",
		    traceCursor: 'pointer',
		    traceOpt: { 'stroke': 'yellow', 'stroke-width': 5, 
        	    'stroke-opacity': 1, 'fill': 'none',
        	    'fill-opacity': 0, 'zindex': 9999},
		    isVisible: true,
		    useRelativePositioning : false, // will position relative to the document by default
		    onHide: function() { console.log("From hide Callback") },
		    onEndTrace: function() { console.log("From end Trace Callback") },
		    onClick: function(me){ me.options.shape.animate({opacity: 0}, 1000, function(){ me.hideTrace(); }); }		
		  }
```

####  Methods and Events
Methods are actions taken on ```trace``` instances.
Methods can be called directly or by triggering the following events: ```hide.trace```, ```show.trace```, ```adjust.trace```.
```JavaScript
//to hide the trace shape do:
$("#elem").trigger("hide.trace");
//or call hideTrace method directly:
ints.hideTrace();

//to show previously initialized trace shape do:
$("#elem").trigger("show.trace");
//or call showTrace method directly:
inst.showTrace();

//to replay trace animation do:
$("#elem").trigger({ type: 'adjust.trace', adjustments: adjustments_object});
//or call reTrace(opt) method directly:
inst.reTrace(adjustments_object)
```

To call the onClick callback function do:
```JavaScript
$("#elem").trigger("click.trace");
//or
inst.click();
```

We can delete ```trace``` instance by triggering "delete.trace" event. 
```JavaScript
$("#elem").trigger("delete.trace");
```

#### Callbacks
Can I have callbacks? Sure. 
```JavaScript
$('#elem').trace({  
	onClick : function(){ console.log('triggered when user clicks on a trace shape.'); }, 
	onHide : function(){ console.log('triggered when hide animation completes.'); },
	onEndTrace: function() { console.log("triggered when trace animation completes."); },
});

```

Author
------
Yuna Portnoy / [valleybazaar.org](http://valleybazaar.org/)

Licence
-------

Do what you like, give credit when you can.
