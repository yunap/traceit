


(function ($) {
	
	window.exports = { 
		    testing: function () {
		     
		       $('#example_title').trace();
		       $('#example').trace({ isVisible: false });
		       $('#example31').trace({ isVisible: false });
		       $('#example32').trace({ isVisible: false });
	    
		    }
	};
	
	$("#trace_example").click(function(e){
		
		e.preventDefault();
		
		//var inst =  $('#example').data('trace');
		//inst.reTrace({ isVisible: true });
		//or call:
		$('#example').trigger('adjust.trace');
		 
	});
	
 
	$("#trace_example2").click(function(e){
		
		e.preventDefault();
		
		$('#example2').trace({ 
			trace_opt : { 
				'stroke': 'blue', 
				'stroke-width': 2, 
				'stroke-opacity': 1, 
				'fill': '#00ff00', 
				'fill-opacity': 0.2 
			},
			redrawspeed : 6000,
			trace_canvas_padding: 4
		});		 
	});
	
	
    $("#trace_example3").click(function(e){
		
		e.preventDefault();
		
		var inst1 =  $('#example31').data('trace');
		inst1.reTrace({ 'stroke': '#880000', 'stroke-width': 2, 'stroke-opacity': 1, 'isVisible' : 'true' });

		$('#example32').data('trace');
		$('#example32').trigger(
		{ 
			type: 'adjust.trace', 
			adjustments: 
				{ 
				'stroke': '#aa0000', 
				'stroke-width': 4, 
				'stroke-opacity': 1 
				}
		});	
		 
	});
	
	$("#trace_example4").click(function(e){
		
		e.preventDefault();
		
		$('#example4').trace(
		{  
		trace_opt : {  
				'stroke-width': 4, 
				'stroke-opacity': .5
		}, 
	        onClick : function( me ) { 
							alert('triggered when user clicks on a trace shape.');
							me.options.shape.animate({opacity: 0}, 1000, function(){ me.HideTrace();}); 
						}, 
			hideCallback : function(){ alert('triggered when hide animation completes.'); },
			endTraceCallback: function() { alert("triggered when trace animation completes."); },
		});
		 
	});
	
})(jQuery);
