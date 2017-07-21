"use strict";
(function(){   
  angular.module('TabsApp')
/********************************************************************************
* This directive links html elements' resizing to onChartResize handler 
* 
* http://microblog.anthonyestebe.com/2013-11-30/window-resize-event-with-angular/
* http://stackoverflow.com/questions/21170607/angularjs-bind-to-directive-resize
*/
.directive('resizable', function($window) {

  return function($scope) {

    $scope.initializeWindowSize = function() {
      $scope.windowHeight = $window.innerHeight;
      $scope.windowWidth = $window.innerWidth;
      $scope.onChatResize($window.innerHeight,$window.innerWidth);
      return $scope.windowWidth;
    };
    
    $scope.initializeWindowSize();
    
    return angular.element($window).bind('resize', function() {
      $scope.initializeWindowSize();
      return $scope.$apply();
    });

  };

});
})();
