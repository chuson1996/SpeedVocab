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