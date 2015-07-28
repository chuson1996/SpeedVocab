/**
 * Created by chuso_000 on 25/7/2015.
 */
angular.module('charts')
    .factory('axesFactory', axesFactory)

function axesFactory(){
    return (function(d3data, scales, options){
        return {
            xAxis: xAxis(d3data, scales, options),
            yAxis: yAxis(d3data, scales, options),
            reset: reset
        };
        //
        function reset(d3data, scales, options){
            this.xAxis = xAxis(d3data, scales, options);
            this.yAxis = yAxis(d3data, scales, options);
        }
        function xAxis(d3data, scales, options){
            //var xScale = d3.time.scale()
            //    .domain([d3.min(options.d3keys), d3.max(options.d3keys)])
            //    .range([0,options.width]);

            return d3.svg.axis()
                .scale(scales.xScale)
                .orient('bottom')
                .ticks(options.ticksX)
                .tickFormat(function (d,i) {
                    if (options.timeScale)
                        return d3.time.format('%e %b')(new Date(d));
                    return i;
                })
                .innerTickSize(0)
                .outerTickSize(0)
                //.tickPadding(20);
        }
        function yAxis(d3data, scales, options){
            return d3.svg.axis()
                .scale(d3.scale.linear()
                    .domain([d3.max(d3data),0])
                    .range([0,options.height]))
                .orient('left')
                .ticks(options.ticksY)
                //.tickValues([1,6,78,32,4])
                //.tickFormat(function (d) {
                //    return '[' + d + ']';
                //})
                .innerTickSize(0)
                .outerTickSize(0)
                //.tickPadding(5);
        }
    });
}