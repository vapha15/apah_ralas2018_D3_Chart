var myApp = angular.module("myApp", []);


 myApp.controller("myController2", function ($scope) {
    $scope.message = "myController2";
});

myApp.controller("myController3", function ($scope) {
    $scope.message = "myController3";
});

myApp.controller('myController', function($scope){
  $scope.rating = 100
});



myApp.directive('slider', function() {
return {
  restrict: 'A',
    scope: {
        ngModel: '='
    },
  link: function(scope, elem, attrs) {

    console.log(scope.ngModel);
    console.log("Virker");

    return $(elem).slider({
      range: "min",
      animate: true,
      value: scope.ngModel,
      slide: function(event, ui) {
        return scope.$apply(function(){
          scope.ngModel = ui.value;
        });
      }
    });
  }
};
});
