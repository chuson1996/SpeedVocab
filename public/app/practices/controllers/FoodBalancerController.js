/// <reference path="../MInterfaces.d.ts" />
var FoodBalancerController = (function () {
    function FoodBalancerController(foodList, OrderByName) {
        this.$inject = ['foodList', 'OrderByName'];
        this.foodList = OrderByName.accending(foodList);
    }
    return FoodBalancerController;
})();
angular.module('app').controller('foodBalancerCtrl', FoodBalancerController);
//# sourceMappingURL=FoodBalancerController.js.map