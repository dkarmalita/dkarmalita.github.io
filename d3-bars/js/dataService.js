"use strict";
(function(){   
  angular.module('TabsApp')
    .factory('dataServ', ['$http',function($http){

        return {

            getJson: function() {
                return $http.get('data/data_barChart.json'); // this will return a promise to controller
            }
                    
        }

    }])
})();

