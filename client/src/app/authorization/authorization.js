angular.module('authorization',['ngResource','ui.router','ui.bootstrap.showErrors','validation.match','authorization.services']);

angular.module('authorization').config(['$stateProvider','$urlRouterProvider',

function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/");
   
     $stateProvider
     .state('login', {
      url: "/login/",
      templateUrl: 'app/authorization/login.tpl.html',
      controller: 'AuthController'
    })
    .state('signup',{
      url: "/signup/",
      templateUrl : 'app/authorization/signup.tpl.html',
      controller: 'AuthController'
    });
}
]);

angular.module('chats').factory('chatsocket',function(){
    var socket = io.connect("http://192.168.1.3:3000/chat");
    return socket;
});


angular.module('authorization').controller('AuthController',['$scope','$resource','$state','$location','AuthService','$window','$rootScope','chatsocket',
        function($scope,$resource,$state,$location,AuthService,$window,$rootScope,chatsocket){
        var AuthSignupResource = $resource('/auth/signup');   
        var AuthLoginResource = $resource('/auth/login'); 

        $scope.loginOauth = function(provider) {
            $window.location.href = '/auth/' + provider;
        };

        $scope.errorExists = false;
           $scope.signup = function(){
                $scope.$broadcast('show-errors-check-validity'); 
                if ($scope.singupForm.$valid){
                  AuthService.signup({email: $scope.email,password: $scope.password, name: $scope.name},function(result){
                    if(!result['type']){
                            $scope.errorExists = true;
                            $scope.loginErrorMessage = result['data'];
                    }else{
                            chatsocket.emit('user:login',{email: $rootScope.currentUser.email});
                            $location.path('/') 
                    }
                });
              }   
          }//signup
        
         $scope.login = function(){
             $scope.$broadcast('show-errors-check-validity'); 
             if ($scope.loginForm.$valid){
                 AuthService.login({'email':$scope.email,'password':$scope.password},function(result){
                     if(!result['type']){
                         $scope.errorExists = true;
                         $scope.loginErrorMessage = result['data'];
                    }else{
                        chatsocket.emit('user:login',{email: $rootScope.currentUser.email});
                        $location.path("/meetup/") 
                    }
                 });
            }
        }//login

        $scope.logout = function(){
            chatsocket.emit('user:logout',{email: $rootScope.currentUser.email});
            AuthService.logout(function(result){
                if(result['status'] == 200){
                    $location.path('/login/');
                } 
            });
        }
    }
]);