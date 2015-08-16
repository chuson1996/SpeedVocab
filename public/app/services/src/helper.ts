/**
 * Created by chuso_000 on 23/6/2015.
 */
declare var angular;
(function () {
    angular.module('services').factory('helper', function ($http) {
        var o={};
        _.assign(o,{
            getSuggestedImages: getSuggestedImages,
            orderByScoreFilter: orderByScoreFilter,
            orderByDate: orderByDate,
            formatDate: formatDate,
        });
        return o;

        function getSuggestedImages(text){
            console.log('get suggested images');
            return $http.get('/speedvocab/api/getSuggestedImages/'+encodeURIComponent(text)).then(function(res){
                //console.log(res.data);
                //$scope.suggestedImages= res.data;
                return res.data;
            });
        }
        function orderByScoreFilter(items){
            var filtered=[];
            if (items === undefined) return items;
            items.forEach(function(item){
                filtered.push(item);
            });
            filtered.sort(function(a,b){
                if ((a.NoCorrectAns- a.NoWrongAns) == (b.NoCorrectAns- b.NoWrongAns)){
                    return (new Date(a.createdAt) < new Date(b.createdAt))? 1: -1;
                }

                return ((a.NoCorrectAns- a.NoWrongAns) >(b.NoCorrectAns- b.NoWrongAns) ? 1: -1);

            });
            return filtered;
        }
        function orderByDate(items){
            var filtered=[];
            if (items === undefined) return items;
            items.forEach(function(item){
                filtered.push(item);
            });
            filtered.sort(function(a,b){
                return (new Date(a.createdAt) < new Date(b.createdAt))? 1: -1;
            });
            return filtered;
        }
        function formatDate(createdAt){
            if (!createdAt) return Date();
            var date = new Date(createdAt).getDate();
            var month = new Date(createdAt).getMonth()+1;
            var year = new Date(createdAt).getFullYear();
            //console.log(new Date(createdAt).getDate());
            //console.log(new Date(createdAt).getMonth()+1);
            //console.log(new Date(createdAt).getFullYear());
            var str = '';
            var monthList='Jan Feb Mar April May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
            str += date+' '+monthList[month-1];
            if (year!==new Date().getFullYear()) str += ' '+year;
            return str;
        }
    });
})();
