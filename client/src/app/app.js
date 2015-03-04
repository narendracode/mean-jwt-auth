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


angular.module('app').controller('AppCtrl', ['$scope','$cookieStore','$location','AuthService','$rootScope', function($scope,$cookieStore,$location,AuthService,$rootScope) {

    
   /* $scope.$on('$locationChangeStart', function( event ) {
        var answer = confirm("Are you sure you want to leave this page?")
        if (!answer) {
            event.preventDefault();
        }
    });
    
    $scope.$on('$destroy', function() {
        //delete window.onbeforeunload;
        var answer = confirm("Are you sure you want to leave this page?")
        if (!answer) {
            event.preventDefault();
        }
    });
    */
    
    window.onunload = function(){ alert(" you are about to close the browser window."); }
    
   var accessLevels = {
        'user': ['user'],
         'admin': ['admin','user']
   };

   $rootScope.hasAccess = function(level){
    //  console.log('##### has access is called.. '+level);

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
