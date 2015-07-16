(function(app){
    function orderByScoreFilter(items){
        var filtered=[];
        if (items === undefined) return items;
        items.forEach(function(item){
            filtered.push(item);
        });
        filtered.sort(function(a,b){
            return ((a.NoCorrectAns- a.NoWrongAns) >(b.NoCorrectAns- b.NoWrongAns) ? 1: -1);

        });
        return filtered;
    }
    app.filter('orderByScoreFilter', function(){
        return orderByScoreFilter;
    });
    app.factory('orderByScoreService', function(){
        return orderByScoreFilter;
    });
}(angular.module('filters')))
