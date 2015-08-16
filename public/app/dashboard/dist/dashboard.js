/**
 * Created by chuso_000 on 28/7/2015.
 */
angular.module('dashboard')
    .controller('DashboardController',dashboardController);

function dashboardController(productivityFactory){
    var db = this;
    db.$inject=['$scope',
        'productivityFactory'];
    db.productivity = {};
    initiateProductivity();
    function initiateProductivity(){
        productivityFactory.getProductivity().then(function (res, err) {
            db.productivity.data = _.reduceRight(res.data, function (result, val, key, arr) {
                result.push(val.amount);
                return result;
            },[]);
            db.productivity.keys = _.reduceRight(res.data, function (result, val, key) {
                var a = new Date(val.time);
                result.push(a);
                return result;
            },[]);
            //console.log('db.productivity.data:', db.productivity.data);
            //console.log('db.productivity.keys:', db.productivity.keys);
        })
    }
}
/**
 * Created by chuso_000 on 28/7/2015.
 */
angular.module('productivity')
    .factory('productivityFactory',productivityFactory);

function productivityFactory($http){
    this.$inject=["$http"];

    return{
        getProductivity: getProductivity
    }
    //
    function getProductivity(){
        return $http.get('/speedvocab/api/productivity');
    }
}