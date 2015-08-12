/**
 * Created by chuso_000 on 16/7/2015.
 */
angular.module('directives')
    .directive('languageSelection', function () {
        return {
            restrict: 'E',
            scope:{
                'dataBind':'=bbind',
                'pplaceholder':'@'
            },
            template:
            '<select class="form-control" ng-model="dataBind" required>' +
                '<option value="" disabled selected class="pplaceholder"></option>' +
                '<option value="zh"> Chinese </option>' +
                '<option value="en"> English </option>' +
                '<option value="fi"> Finnish </option>' +
                '<option value="ru"> Russian </option>' +
                '<option value="vi"> Vietnamese </option>' +
            '</select>',
            link:function(scope, elem, attrs){
                elem.find('option.pplaceholder').html(scope.pplaceholder);
            }
        }
    })
