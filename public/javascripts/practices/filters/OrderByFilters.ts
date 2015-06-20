/**
 * Created by chuso_000 on 17/6/2015.
 */
/// <reference path="../MInterfaces.d.ts" />
declare var _;
declare var angular;
enum AccendOrDecend { '+','-' };
class OrderByName{
    constructor(){

    }
    accending(data: foodNutrition){
        if (data){
            return _.sortBy(data, function(n){
                return n.name;
            });
        }
        return;
    }
    decending(data: foodNutrition){
        if (data){
            return _.sortBy(data, function(n){
                return n.name;
            }).reverse();
        }
        return;
    }
}
angular.module('filters',[]).service('OrderByName', OrderByName);