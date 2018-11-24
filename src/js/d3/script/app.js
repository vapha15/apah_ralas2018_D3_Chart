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
    return $(elem).slider({
      max:100,
      min: 0,
      step: 1,
      range: false,
      value: 50,
      slide: function(event, ui) {
      console.log(ui.value)
      }
    });
  }
};
});
