angular.module('bubbles',['ngResource','ui.bootstrap.showErrors','angularMoment','ui.router','bubble.services','authorization.services']);

angular.module('bubbles').config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/");
   $stateProvider
   .state('bubble', {
               url: "/bubble/",
               templateUrl: 'app/bubble/list.tpl.html',
               controller: 'BubbleController'
   })
  .state('bubbleDetail',{
              url: "/bubble/details/",
              templateUrl : 'app/bubble/details.tpl.html',
              controller: 'BubbleController'
  });
}]);

angular.module('bubbles').controller('BubbleController',['$scope','$resource','$state','$location','BubbleService',                                                 
                        function($scope,$resource,$state,$location,BubbleService){
                                                                                                                 
                        }
]);
