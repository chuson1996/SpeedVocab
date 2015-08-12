/// <reference path="../MInterfaces.d.ts" />

class FoodBalancerController{
    $inject=['foodList','OrderByName'];
    foodList: foodNutrition;
    constructor(foodList: foodNutrition, OrderByName){
        this.foodList = OrderByName.accending(foodList);
    }
}
declare var angular;
angular.module('app').controller('foodBalancerCtrl', FoodBalancerController);

