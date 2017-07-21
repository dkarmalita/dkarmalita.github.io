"use strict";
(function(){
   angular.module('TabsApp', ['nvd3']);
})();
/*
    TO-DO:
    [ ] CSS final tuning
    [ ] Ajust thickness and shadows of the bars
    [x] Add CSS variable for easy switch bar colors between predefined/json defined.
    [x] Drop basic shadows for the chart bars
    [x] Waiting till the DOM fully loaded
    [x] Loading indicator
    [x] Fix chart margins while resizing
    [x] LESS incorporation
    [x] Chart resizing
    [x] Calculate rounded max values of Y axis for each tab
    [x] Load JSON from file
    [x] CSS tuning dtarft

    NVD3 Documentation: 
        http://nvd3-community.github.io/nvd3/examples/documentation.html
        https://www.npmjs.com/package/angular-nvd3
        http://krispo.github.io/angular-nvd3/#/discreteBarChart
    SVG Axis properties in D3: https://github.com/d3/d3/wiki/SVG-Axes
    Angular-nvD3: http://krispo.github.io/angular-nvd3/#/quickstart

    Prototype:
    http://docs.sebgroup.com/pow/apps/sebpension/flash/barGraph/Bar_Line_Graph_aalund/barGraph.swf

*/

