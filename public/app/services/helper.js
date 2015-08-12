var helper = (function () {
    function helper() {
    }
    helper.prototype.getSuggestedImages = function ($http, text) {
        console.log('get suggested images');
        return $http.get('/speedvocab/api/getSuggestedImages/' + encodeURIComponent(text)).then(function (res) {
            //console.log(res.data);
            //$scope.suggestedImages= res.data;
            return res.data;
        });
    };
    helper.prototype.orderByScoreFilter = function (items) {
        var filtered = [];
        if (items === undefined)
            return items;
        items.forEach(function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            if ((a.NoCorrectAns - a.NoWrongAns) == (b.NoCorrectAns - b.NoWrongAns)) {
                return (new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : -1;
            }
            return ((a.NoCorrectAns - a.NoWrongAns) > (b.NoCorrectAns - b.NoWrongAns) ? 1 : -1);
        });
        return filtered;
    };
    helper.prototype.orderByDate = function (items) {
        var filtered = [];
        if (items === undefined)
            return items;
        items.forEach(function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (new Date(a.createdAt) < new Date(b.createdAt)) ? 1 : -1;
        });
        return filtered;
    };
    helper.prototype.formatDate = function (createdAt) {
        if (!createdAt)
            return Date();
        var date = new Date(createdAt).getDate();
        var month = new Date(createdAt).getMonth() + 1;
        var year = new Date(createdAt).getFullYear();
        //console.log(new Date(createdAt).getDate());
        //console.log(new Date(createdAt).getMonth()+1);
        //console.log(new Date(createdAt).getFullYear());
        var str = '';
        var monthList = 'Jan Feb Mar April May Jun Jul Aug Sep Oct Nov Dec'.split(' ');
        str += date + ' ' + monthList[month - 1];
        if (year !== new Date().getFullYear())
            str += ' ' + year;
        return str;
    };
    return helper;
})();
angular.module('services').service('helper', helper);
//# sourceMappingURL=helper.js.map