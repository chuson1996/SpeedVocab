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