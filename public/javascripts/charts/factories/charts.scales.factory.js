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