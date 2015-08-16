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