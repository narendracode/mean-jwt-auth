angular.module('app', [
                'ngResource',
                'ui.router',
               'authorization',
                'authorization.services',
		        'ngCookies',
                'meetups',
                'chats'
                ]
);

angular.module('app').config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/")
    $stateProvider
    .state('index', {
      url: "/",
      templateUrl: "app/index.tpl.html",
      controller: 'AppCtrl'
    });

}]);

angular.module('app').factory('chatsocket',function(){
    var socket = io.connect("http://192.168.1.3:3000/chat");
    return socket;
});


angular.module('app').controller('AppCtrl', ['$scope','$cookieStore','$location','AuthService','$rootScope','chatsocket', function($scope,$cookieStore,$location,AuthService,$rootScope,chatsocket) {

    
   var accessLevels = {
        'user': ['user'],
         'admin': ['admin','user']
   };

   $rootScope.hasAccess = function(level){
       if($rootScope.currentUser && accessLevels[$rootScope.currentUser['role']]){
          if(accessLevels[$rootScope.currentUser['role']].indexOf(level) > -1)
            return true;
          else
           return false;
      }else
       return false;
   }
   
   AuthService.currentUser(function(result){
      	console.log(" $$$ current user info returned : "+JSON.stringify(result));
		if(result['status']){
			if(result['status']==404){
				$rootScope.currentUser = null;               
			}
		}
       if(result.type){
           chatsocket.emit('user:login',{email: $rootScope.currentUser.email});
       }
	});
	$rootScope.currentUser = $cookieStore.get('user');

	$scope.logout = function(){
		AuthService.logout(function(result){
			console.log("Response after logout: "+JSON.stringify(result));
			//if(result['status']==200){
				$rootScope.currentUser = null;
				$location.path('/login/');
			//}
		});
	}
}]);

angular.module('app').controller('HeaderCtrl', ['$scope','$location','AuthService', function($scope,$location,AuthService) {    

}]);
