/**
 * Created by chuso_000 on 26/7/2015.
 */
angular.module('charts',[]);
/**
 * Created by chuso_000 on 24/7/2015.
 */
angular.module('charts')
    .directive('barChart', function (scalesFactory, axesFactory) {
        return {
            restrict: 'E',
            scope:{
                margin: '=',
                animation: '@',
                d3data: '=d3data',
                d3keys: '=d3keys',
                width: '=width',
                height: '=height',
                barPadding: '=barPadding',
                outerPadding: '=outerPadding',
                colorRange: '=colorRange', // Ex: ['yellow','red']
            },
            link: link
        };
        //
        function link(scope, elem, attrs){
            var margin,
                animation,
                d3data,
                width,
                height,
                barPadding,
                outerPadding,
                colorRange;
            var svg,
                barContainer,
                xAxisContainer,
                yAxisContainer;

            init();
            /*
             * data = d3data;
             * options = {
             *   color: {
             *       range: ['red','yellow']
             *   }
             * }
             * */
            var options = {
                width: width,
                height: height,
                margin: margin,
                barPadding: parseFloat(barPadding),
                outerPadding: parseFloat(outerPadding),
                color:{
                    range: scope.colorRange
                },
                d3keys:scope.d3keys
            };
            var scales = scalesFactory(d3data, options );
            var axes = axesFactory(d3data, scales, options);

            renderContainers();
            renderBars(true); // true -> first time render bars
            renderAxes();
            changeListener();


            function init(){
                margin = scope.margin || {
                        top:0,
                        left:0,
                        bottom:0,
                        right:0
                    };
                animation = scope.animation || 'linear';
                d3data = scope.d3data || [];
                console.log(d3data);
                width = scope.width - margin.left - margin.right || 0;
                height = scope.height - margin.top - margin.bottom || 0;
                barPadding = parseFloat(scope.barPadding) || 0;
                outerPadding = parseFloat(scope.outerPadding) || 0;
                colorRange = scope.colorRange || null;
            }
            function renderContainers(){
                svg = d3.select(elem[0]).append('svg');
                svg
                    .attr('width',width + margin.left +margin.right)
                    .attr('height',height + margin.top + margin.bottom);

                barContainer = svg.append('g');
                barContainer
                    .attr('transform','translate('+margin.left+','+(margin.top)+')');

                xAxisContainer = svg.append('g');
                xAxisContainer
                    .attr('class','x axis')
                    .attr('transform','translate('+(margin.left)+','+(height+margin.top)+')');

                yAxisContainer = svg.append('g');
                yAxisContainer
                    .attr('class','y axis')
                    .attr('transform','translate('+(margin.left)+','+(margin.top)+')')
            }
            function renderBars(first){
                first = first || false;
                var rects = barContainer.selectAll('rect')
                    .data(d3data);

                if (first) {

                    rects
                        .enter()
                        .append('rect')
                        .attr('width', function () {
                            return scales.xScale.rangeBand();
                        })
                        .attr('x', function (d, i) {
                            return scales.xScale(i);
                        })
                        .attr('y', function () {
                            return height - scales.yScale(0);
                        })
                        .attr('fill', function (d) {
                            return scales.colorScale(d);
                        })
                        .attr('height', function (d) {
                            return scales.yScale(0);
                        });
                }
                rects
                    .transition()
                    .duration(500)
                    .ease(animation)
                    .delay(function (d, i) {
                        return i * 100;
                    })
                    .attr('height', function (d) {
                        return scales.yScale(d);
                    })
                    .attr('y', function(d){
                        return height - scales.yScale(d);
                    }).attr('fill', function (d) {
                        return scales.colorScale(d);
                    });


                rects.exit().remove();
            }
            function renderAxes(){
                xAxisContainer.call(axes.xAxis);
                yAxisContainer.call(axes.yAxis);
            }
            function changeListener(){
                scope.$watch(function () {
                    return scope.d3data;
                }, function (n,o) {
                    if (o!==n) {
                        //console.log(scales);
                        d3data = scope.d3data;
                        //scales.reset.call(scales);
                        //axes.reset.call(axes);
                        renderBars();
                        renderAxes();
                    }
                }, true);
            }


        }
    });
/**
 * Created by chuso_000 on 25/7/2015.
 */
angular.module('charts')
    .directive('lineChart', function(scalesFactory, axesFactory){
        return {
            restrict: 'E',
            scope:{
                margin: '=',
                animation: '@',
                d3data: '=d3data',
                d3keys: '=d3keys',
                width: '=width',
                height: '=height',
                outerPadding: '=outerPadding',
                interpolate: '@',
                ticksX: '@',
                ticksY: '@'
            },
            link: link
        };

        //
        function link(scope, elem, attrs){
            var margin,
                animation,
                d3data,
                width,
                height,
                outerPadding,
                barPadding,
                ticksX,
                ticksY,
                interpolate;
            var svg,
                barContainer,
                xAxisContainer,
                yAxisContainer;
            var lines;

            init();
            /*
             * data = d3data;
             * options = {
             *   color: {
             *       range: ['red','yellow']
             *   }
             * }
             * */
            var options = {
                width: width,
                height: height,
                margin: margin,
                barPadding: parseFloat(barPadding),
                ticksX: ticksX,
                ticksY: ticksY,
                outerPadding: parseFloat(outerPadding),
                d3keys:scope.d3keys,
                timeScale: true
            };
            var scales = scalesFactory(d3data, options);
            var axes = axesFactory(d3data, scales, options);

            renderContainers();
            renderAxes();
            renderLines(true);
            changeListener();




            function init(){
                margin = scope.margin || {};
                animation = scope.animation || 'linear';
                d3data = scope.d3data || [];
                width = scope.width - margin.left - margin.right || 0;
                height = scope.height - margin.top - margin.bottom || 0;
                barPadding = parseFloat(scope.barPadding) || 0;
                ticksX = parseInt(scope.ticksX) || 0;
                //console.log(scope.ticksX, scope.ticksY);
                ticksY = parseInt(scope.ticksY) || 0;
                outerPadding = parseFloat(scope.outerPadding) || 0;
                interpolate = scope.interpolate || 'linear';
            }
            function renderContainers(){
                svg = d3.select(elem[0]).append('svg');
                svg
                    .attr('width',width + margin.left +margin.right)
                    .attr('height',height + margin.top + margin.bottom);

                barContainer = svg.append('g');
                barContainer
                    .attr('transform','translate('+margin.left+','+(margin.top)+')');

                xAxisContainer = svg.append('g');
                xAxisContainer
                    .attr('class','x axis')
                    .attr('transform','translate('+(margin.left)+','+(height+margin.top)+')');

                yAxisContainer = svg.append('g');
                yAxisContainer
                    .attr('class','y axis')
                    .attr('transform','translate('+(margin.left)+','+(margin.top)+')')
            }
            function renderAxes(){

                xAxisContainer.call(axes.xAxis);
                //== axes.xAxis(xAxisContainer);
                yAxisContainer.call(axes.yAxis);
                //== axes.yAxis(yAxisContainer);
            }
            function renderLines(first){
                var lineF = d3.svg.line()
                    .x(function(d,i){
                        return scales.xScale(options.d3keys[i]);
                    })
                    .y(function(d,i){
                        return height - scales.yScale(d);
                    })
                    .interpolate(interpolate);

                if (first)
                {
                    lines = barContainer.append('path')
                        .attr('class','line')
                }
                else{
                    lines = barContainer.select('path')
                }
                lines = lines.datum(d3data);
                lines
                    .transition()
                    .duration(500)
                    .ease(animation)
                    .attr('d',lineF);
                //lines.exit().remove();
            }
            function changeListener(){
                scope.$watch(function () {
                    return scope.d3data;
                }, function (n,o) {
                    d3data = scope.d3data;
                    options.d3keys = scope.d3keys;
                    if (o!==n) {
                        scales.reset.call(scales,d3data, options);
                        axes.reset.call(axes, d3data, scales, options);
                        renderLines();
                        renderAxes();

                    }
                }, true);
            }


        }

    })
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
angular.module('charts')
    .factory('scalesFactory', scalesFactory);

function scalesFactory(){
    return (function(d3data, options){
        return {
            reset:reset,
            xScale:xScale(d3data, options),
            yScale:yScale(d3data, options),
            colorScale:colorScale(d3data, options)
        };
        //
        function reset(d3data, options){
            this.xScale = xScale(d3data, options);
            this.yScale = yScale(d3data, options);
            this.colorScale = colorScale(d3data, options);
        }
        function xScale(d3data, options){
            if (options.timeScale)
                return d3.time.scale()
                    .domain([d3.min(options.d3keys), d3.max(options.d3keys)])
                    .range([0,options.width]);

            return d3.scale.ordinal()
                .domain(_.range(d3data.length))
                .rangeBands([0,options.width],options.barPadding,options.outerPadding);
        }
        function yScale(d3data, options){
            return d3.scale.linear()
                .domain([0, d3.max(d3data)])
                .range([0, options.height]);
        }
        function colorScale(d3data, options){
            if (options.color && options.color.range)
                return d3.scale.linear()
                    .domain([0, d3.max(d3data)])
                    .range(options.color.range);
        }

    });
}