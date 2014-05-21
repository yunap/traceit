traceit
=======


traceit.js is a jQuery plugin based on raphael.js that allows you dynamically trace page elements.

Add a dynamic trace to any element on a page; configure its stroke width, animation speed, stroke/fill color and opacity as well as hideCallback, 
endTraceCallback and onClick callback functions.

Trace size adapts to contents. 

Examples
--------

[traceit.js examples](http://valleybazaar.org/index.html#tracebox)

Usage:
------

$('#elem').data('trace');

var inst = $('#elem').data('trace');

inst.myMethod();

$("#elem").trigger("myEvent");
	
Can I have callbacks? Sure. 

$('#elem').trace({  
	onClick : function(){ console.log('triggered when user clicks on a trace shape.'); }, 
	hideCallback : function(){ console.log('triggered when hide animation completes.'); },
	endTraceCallback: function() { console.log("triggered when trace animation completes."); },
});

Author
------
Yuna Portnoy / [valleybazaar.org](http://valleybazaar.org/)

Licence
-------

Do what you like, give credit when you can.
