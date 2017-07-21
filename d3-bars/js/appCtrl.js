"use strict";
(function(){   
  angular.module('TabsApp')
    .controller('TabsCtrl', ['$scope', 'dataServ', function($scope, dataServ){

        const   TICKFONTSIZE = 0.03,    //  See LESS
                TITLEFONTSIZE = 0.04,   //  See LESS
                D3CONST = 55;

        //  Set loading indicator active
        $scope.currentView = "loading.tpl.html";

//  A => RES TMP

    function dropShadows(){

        console.log("dropShadows");

        var svg = d3.select("svg");
        var filter = svg.append("defs").append("filter")
            .attr("height", "120%")    //125% adjust this if shadow is clipped
//            .attr("width", "200%")    //125% adjust this if shadow is clipped
            .attr("id", "drop-shadow");

// ************************************************************************************************************* 
// src: https://github.com/wbzyl/d3-notes/blob/master/hello-drop-shadow.html
//  
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 6)     //2
            .attr("result", "blur");
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 4)  //4
            .attr("dy", 0)  //4
            .attr("result", "offsetBlur");

        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        var item = svg.selectAll("rect")
            .style("filter", "url(#drop-shadow)");

    }

    $scope.$on('tooltipShow.directive', function(angularEvent, event){
        console.log("tooltipShow.directive");
    });
//  A <= RES TMP

    $scope.tabs = [{
    //  Empty chart data (default state)
        title:          '...',
        secondTitle:    '...',
        id:             0,
        min:            0,
        max:            10,
        data: [{
            values:     [],
            yLabel:     ''
        }]
    }];

    $scope.options = {
    //  Default options for the chart
        chart: {
            type: 'discreteBarChart',
            height: 500,
            margin : {
                top: 20,
                right: 20,
                bottom: 50,
                left: 55
            },
//  B => RES TMP
            dispatch: {
                // 
                beforeUpdate: function (t,u){
                    console.log("beforeUpdate: "+t+" : "+u);
                },
                // BUG: For some unclear reason it:
                //  Got consistantly called when window is resized
                //  Got only sometime called chart is reloaded from the code
                //  SOLUTION: Use callbeck function at the end 
                //      of the chart.options section (see bellow)
                renderEnd: function(e) {
                    console.log("\"renderEnd\" is happen");
                    //dropShadows();     
                    //console.log(document.styleSheets);              
                }
//  B <= RES TMP
            },
            x: function(d){return d.year;},
            y: function(d){return d.value;},
            color: function(d){                     //@ Set separate color for each bar
                var x = d.color;
                if ('undefined' == typeof x) {
                    x = '#666666' // Gray40 (web safe to Dim Gray)
                };
                return x
            },    
            showValues: false,                      //@ Hide values
            yDomain: [0, 5],                        //@ Set max of Y
            staggerLabels: false,                   //@ Stop stragging labels
            duration: 0,//500,
            xAxis: {
                axisLabel: ''                       //'X Axis Label'
            },
            yAxis: {
                axisLabel: '',                      //@ Default label for Y Axis
                axisLabelDistance: -15,             //@ Note that this value can cut off the Y-Title
                tickFormat: d3.format('d')          //@ Set axis tick format
            },
//  C => RES TMP
            callback: function(){
            // ref: http://stackoverflow.com/questions/23928508/nvd3-angular-directive-callback-firing-too-soon
//                alert("Hi, I'm callback!");
                console.log("Hi, I'm callback!");
                dropShadows();
            }
//  C <= RES TMP

        }
    }

    function redrawChart(duration){
    // Update chart size/margins calculations according to the YAxis title and window size

        var vMin = (($scope.windowHeight < $scope.windowWidth) ? $scope.windowHeight : $scope.windowWidth);
        $scope.options.chart.margin.left = ('' == $scope.options.chart.yAxis.axisLabel) // If label not exists
            ? vMin * TICKFONTSIZE
            : D3CONST;

        $scope.options.chart.duration = duration;
        $scope.options.chart.yAxis.axisLabelDistance = -(Math.ceil(vMin * 0.04)/2);    // Half of the title font size (CSS: ".nv-y .nv-axislabel")
        $scope.options.chart.height = $scope.windowHeight * 0.7;

        // **** NOTE: *****************************************************************************************
        // http://stackoverflow.com/questions/294250/how-do-i-retrieve-an-html-elements-actual-width-and-height
        // var element = document.getElementById('foo');
        // var height = element.offsetHeight;
        // var width = element.offsetWidth;
    }

    function setChart(tab){
    //  Update chart in depends on tab's data

        $scope.options.chart.yAxis.axisLabel = ('undefined' == typeof tab.data[0].yLabel) ? '' : tab.data[0].yLabel; 
        $scope.options.chart.yDomain[0] = tab.min;
        $scope.options.chart.yDomain[1] = tab.max;   
        redrawChart(500);
    }

    $scope.onChatResize =function (h,w){
    //  All of the neccesary updates when window size is changed

        redrawChart(0);
    }

    $scope.onClickTab = function (tab) {
        setChart(tab);
        $scope.currentTabId = tab.id;
    }
    
    $scope.isActiveTab = function(tabId) {
        return tabId == $scope.currentTabId;
    }

    function parseTabs(json){
    //  Parse $scope.json into $scope.tabs

        function getMax(vals){
        // Calculate max for a JSON dataset
            var max = 0;
            for (let i = 0; i < vals.length; i++) {
                if (max<vals[i].value){max = Math.ceil(vals[i].value)};
            };
            return max;
        };

        // Load tabs array from JSON raw
        var tabs = [];
        for (let i = 0; i < json.data.tabs.length; i++) {
            tabs.push({
                title:          json.data.tabs[i].mainTitle,
                secondTitle:    json.data.tabs[i].secondTitle,
                id:             i,
                min:            0,
                max:            getMax(json.data.tabs[i].dataset),
                data: [{
                    values:     json.data.tabs[i].dataset,
                    yLabel:     json.data.tabs[i].yLabel
                }]
            })
        };

        return tabs;
    }

    angular.element(document).ready(function () {
    //  Wait untill the DOM is completely loaded

        console.log('page loading completed');

        dataServ.getJson().then(function(response) { 
        //  When data is ready, parse JSON and draw the chart 

            //  Parse JSON raw into $scope.tabs array 
            $scope.tabs = parseTabs(response);

            //  Draw the first tab
            $scope.onClickTab($scope.tabs[0]);

            //  Replace loading indicator with chart
            $scope.currentView = "chart.tpl.html";

        });
    });


   }])
})();
