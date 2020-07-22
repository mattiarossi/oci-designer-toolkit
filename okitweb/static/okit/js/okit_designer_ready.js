/*
** Copyright (c) 2020, Oracle and/or its affiliates.
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
*/
console.info('Loaded Designer Ready Javascript');

/*
** Define variables for Artefact classes
 */
let okitJson = new OkitJson();
let okitOciConfig = new OkitOCIConfig();
let okitOciData = new OkitOCIData();
let okitSettings = new OkitSettings();
/*
** Ready function initiated on page load.
 */
$(document).ready(function() {
    /*
    ** Initialise OKIT Variables
     */
    okitOciConfig = new OkitOCIConfig();
    okitOciData = new OkitOCIData();
    okitSettings = new OkitSettings();
    okitJson = new OkitJson();

    /*
    ** Add handler functionality
     */
    console.info('Adding Designer Handlers');

    // Left Bar & Panels
    d3.select(d3Id('console_left_bar')).append('label')
        .attr('id', 'toggle_palette_button')
        .attr('class', 'okit-bar-panel-displayed okit-pointer-cursor')
        .on('click', function () {
            /*
            $(jqId('designer_left_column')).toggleClass('okit-slide-hide-left');
            $(this).toggleClass('okit-bar-panel-displayed');
            setTimeout(redrawSVGCanvas, 260);
            */
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideLeftPanelsOffScreen();
            if (!open) {
                $('#icons_palette').removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
            }
            checkLeftColumn();
        })
        .text('Palette');

    d3.select(d3Id('console_left_bar')).append('label')
        .attr('id', 'toggle_explorer_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideLeftPanelsOffScreen();
            if (!open) {
                $('#explorer_panel').removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                let okit_tree = new OkitJsonTreeView(okitJson, 'explorer_panel');
                okit_tree.draw();
            } else {
                $('#explorer_panel').empty();
            }
            checkLeftColumn();
        })
        .text('Explorer');

    d3.select(d3Id('console_left_bar')).append('label')
        .attr('id', 'toggle_preferences_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideLeftPanelsOffScreen();
            if (!open) {
                $('#preferences_panel').removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                okitSettings.buildPanel('preferences_panel', true);
            } else {
                $('#preferences_panel').empty();
            }
            checkLeftColumn();
        })
        .text('Preferences');

    // Right Bar & Panels
    d3.select(d3Id('console_right_bar')).append('label')
        .attr('id', 'toggle_properties_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideRightPanelsOffScreen();
            if (!open) {
                $(jqId(PROPERTIES_PANEL)).removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                $(jqId('right_column_dragbar')).removeClass('hidden');
            }
            checkRightColumn();
        })
        .text('Properties');

    d3.select(d3Id('console_right_bar')).append('label')
        .attr('id', 'toggle_source_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideRightPanelsOffScreen();
            if (!open) {
                $(jqId(JSON_PANEL)).removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                $(jqId('right_column_dragbar')).removeClass('hidden');
            }
            // Check to see if Right Column needs to be hidden
            checkRightColumn();
            // Display Json
            displayOkitJson();
        })
        .text('Json');

    d3.select(d3Id('console_right_bar')).append('label')
        .attr('id', 'toggle_validation_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideRightPanelsOffScreen();
            if (!open) {
                $(jqId(VALIDATION_PANEL)).removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                $(jqId('right_column_dragbar')).removeClass('hidden');
                okitJson.validate(displayValidationResults);
            }
            // Check to see if Right Column needs to be hidden
            checkRightColumn();
        })
        .text('Validate');

    // TODO: Uncomment when Value Proposition files have been created
    /*
    d3.select(d3Id('console_right_bar')).append('label')
        .attr('id', 'toggle_value_proposition_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideRightPanelsOffScreen();
            if (!open) {
                $(jqId(VALUE_PROPOSITION_PANEL)).removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                $(jqId('right_column_dragbar')).removeClass('hidden');
            }
            // Check to see if Right Column needs to be hidden
            checkRightColumn();
        })
        .text('Value Proposition');
     */

    // TODO: Integrate Estimate Calculator
    /*
    d3.select(d3Id('console_right_bar')).append('label')
        .attr('id', 'toggle_cost_estimate_button')
        .attr('class', 'okit-pointer-cursor')
        .on('click', function () {
            let open = $(this).hasClass('okit-bar-panel-displayed');
            slideRightPanelsOffScreen();
            if (!open) {
                $(jqId(COST_ESTIMATE_PANEL)).removeClass('hidden');
                $(this).addClass('okit-bar-panel-displayed');
                $(jqId('right_column_dragbar')).removeClass('hidden');
                okitJson.estimateCost(displayPricingResults);
            }
            // Check to see if Right Column needs to be hidden
            checkRightColumn();
        })
        .text('Cost Estimate');
     */

    console.info('Added Designer Handlers');

    /*
    ** Add Load File Handling
     */
    document.getElementById('files').addEventListener('change', handleFileSelect, false);

    /*
    ** Load Empty Properties Sheet
     */
    $(jqId(PROPERTIES_PANEL)).load('propertysheets/empty.html');

    /*
    ** Add Drag Bar Functionality
     */
    $(jqId('right_column_dragbar')).mousedown(function(e) {
        e.preventDefault();
        right_drag_bar_start_x = e.pageX;
        dragging_right_drag_bar = true;
        let main_panel = $('.main');
        let ghostbar = $('<div>',
            {
                id: 'ghostbar',
                css: {
                    height: main_panel.outerHeight(),
                    top: main_panel.offset().top,
                    left: main_panel.offset().left
                },
                class: 'okit-vertical-ghost-bar'
            }).appendTo('body');

        $(document).mousemove(function(e) {
            ghostbar.css("left",e.pageX+2);
        });
    });

    /**/
    $(document).mouseup(function (e) {
        if (dragging_right_drag_bar) {
            let center_column_width = $(jqId('designer_center_column')).width();
            let right_column_width = $(jqId('designer_right_column')).width();
            let moved = right_drag_bar_start_x - e.pageX;
            let new_width = right_column_width + moved;
            // Remove Bar artifacts
            $(jqId('ghostbar')).remove();
            $(document).unbind('mousemove');
            dragging_right_drag_bar = false;
            // Set Width
            $(jqId('designer_right_column')).width(new_width);
            if (new_width > 250) {
                $(jqId('designer_right_column')).css('min-width', new_width);
            } else {
                $(jqId('designer_right_column')).css('min-width', 250);
            }
            setTimeout(redrawSVGCanvas, 260);
        }
    });
    /**/

    setOCILink();

    /*
    ** Check Palette layout
     */

    if (!okitSettings.icons_only) {
        $(jqId("icons_and_text")).prop('checked', 'checked');
        $(jqId("icons_and_text")).click();
    }


    /*
    ** Display New Canvas
     */
    newDiagram();
    redrawSVGCanvas();

    /*
    ** Add redraw on resize
     */
    window.addEventListener('resize', () => { redrawSVGCanvas() });
});
