;
(function($) {

    window.exports = {
        testing: function() {

            $('#example_title').trace();
            $('#example').trace({
                isVisible: false
            });
            $('#example31').trace({
                'isVisible': false,
                'traceCanvasPadding': 8
            });
            $('#example32').trace({
                isVisible: false
            });

        }
    };

    $("#trace_example").click(function(e) {

        //var inst =  $('#example').data('trace');
        //inst.reTrace({ isVisible: true });
        //or call:
        $('#example').trigger('adjust.trace');

    });


    $("#trace_example2").click(function(e) {

        $('#example2').trace({
            traceOpt: {
                'stroke': 'blue',
                'stroke-width': 2,
                'stroke-opacity': 1,
                'fill': '#00ff00',
                'fill-opacity': 0.2,
                'gap-point': 'top_left',
                'title': "see, this is example2! Click to hide."
            },
            redrawSpeed: 6000,
            traceCanvasPadding: 6
        });
    });


    $("#trace_example3").click(function(e) {

        var inst1 = $('#example31').data('trace');
        inst1.reTrace({
            'stroke': '#880000',
            'stroke-width': 2,
            'stroke-opacity': 1,
            'arrow-end': 'classic-wide-long',
            'isVisible': 'true'
        });

        $('#example32').data('trace');
        $('#example32').trigger({
            type: 'adjust.trace',
            adjustments: {
                'stroke': '#aa0000',
                'stroke-width': 4,
                'stroke-opacity': 1,
                'stroke-dasharray': '--..',
                'gap-point': 'bottom_right'
            }
        });

    });

    $("#trace_example4").click(function(e) {

        $('#example4').trace({
            traceOpt: {
                'stroke-width': 4,
                'stroke-opacity': .5
            },
            onClick: function(me) {
                alert('triggered when user clicks on a trace shape.');
                me.options.shape.animate({
                    opacity: 0
                }, 1000, function() {
                    me.hideTrace();
                });
            },
            onHide: function() {
                alert('triggered when hide animation completes.');
            },
            onEndTrace: function() {
                alert("triggered when trace animation completes.");
            },
        });

    });

})(jQuery);
