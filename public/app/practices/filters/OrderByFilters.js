/// <reference path="../MInterfaces.d.ts" />
var AccendOrDecend;
(function (AccendOrDecend) {
    AccendOrDecend[AccendOrDecend['+'] = 0] = '+';
    AccendOrDecend[AccendOrDecend['-'] = 1] = '-';
})(AccendOrDecend || (AccendOrDecend = {}));
;
var OrderByName = (function () {
    function OrderByName() {
    }
    OrderByName.prototype.accending = function (data) {
        if (data) {
            return _.sortBy(data, function (n) {
                return n.name;
            });
        }
        return;
    };
    OrderByName.prototype.decending = function (data) {
        if (data) {
            return _.sortBy(data, function (n) {
                return n.name;
            }).reverse();
        }
        return;
    };
    return OrderByName;
})();
angular.module('filters', []).service('OrderByName', OrderByName);
//# sourceMappingURL=OrderByFilters.js.map