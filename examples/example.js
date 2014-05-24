


(function ($) {
	
	window.exports = { 
		    testing: function () {
		     
		       $('#example_title').trace();
		       $('#example').trace({ isVisible: false });
		       $('#example3').trace({ isVisible: false });
	    
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
		
		var inst =  $('#example3').data('trace');
		$('#example3').trigger(
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
	
	
	
})(jQuery);