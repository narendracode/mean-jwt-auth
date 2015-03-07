angular.module('meetups',['ngResource','ui.bootstrap.showErrors','angularMoment','ui.router','meetup.services','authorization.services']);

angular.module('meetups').config(['$stateProvider','$urlRouterProvider',

function($stateProvider,$urlRouterProvider){
    $urlRouterProvider.otherwise("/");
    $stateProvider
    .state('meetup', {
      url: "/meetup/",
      templateUrl: 'app/meetups/list.tpl.html',
      controller: 'MeetupsController',
      data: {
            authRequired: true,
            access: ['user','admin']
      }
    })
    .state('meetupcreate',{
      url: "/meetup/create/",
      templateUrl : 'app/meetups/create.tpl.html',
      controller: 'MeetupsController',
      data: {
            authRequired: true,
            access: ['user','admin']
      }
    })
    .state('meetupview', {
      url: "/meetup/:id/",
      templateUrl : 'app/meetups/details.tpl.html',
      controller: 'MeetupsController',
      data: {
            authRequired: true,
            access: ['user','admin']
      }
    })
     .state('meetupedit', {
      url: "/meetup/:id/edit/",
      templateUrl: 'app/meetups/edit.tpl.html',
      controller: 'MeetupsController',
      data: {
            authRequired: true,
            access: ['user','admin']
      }
    });                               
}
]);


angular.module('meetups').run(function($rootScope,$location){
    return $rootScope.$on("$stateChangeStart", function(event, next) {
        if(next){
            if(next.data){
                if(next.data.authRequired){
                    if($rootScope.currentUser){
                        //do nothing 
                    }else{
                        $location.path('/login/');
                    }
                }
            }
        }else{
            console.log("found nothing for authentication..."); 
        }
    });
});


angular.module('meetups').factory('socket',function(){
    var socket = io.connect("http://192.168.1.3:3000/meetup");
    return socket;
});


angular.module('meetups').controller('MeetupsController',['$scope','$resource','$state','$location','MeetupUpdateService','socket',                                                   function($scope,$resource,$state,$location,MeetupUpdateService,socket){
    var MeetupResource = $resource('/meetup/:id'); //this will be the base URL for our rest express route.
            $scope.appname = "Mean Demo";
            $scope.meetupUpdateService = new MeetupUpdateService();
            var loadMeetups = function(){
                return MeetupResource.query(function(results){
                $scope.meetups = results;
                    if($state.params.id){
                        $scope.findMeetup($state.params.id);
                    }
                });
            }
            
            socket.on('new meetup',function(data){
                loadMeetups();
            });
            
            socket.on('edit meetup',function(data){
                loadMeetups();
            });
                
            socket.on('delete meetup',function(data){
                loadMeetups();
            });
                                                              
            
            if(!$scope.meetups){
                loadMeetups();
            }

            $scope.createMeetup = function(){
                $scope.$broadcast('show-errors-check-validity'); 
                if ($scope.meetupCreateForm.$valid){ 
                    var createMeetupResource = new MeetupResource();
                    createMeetupResource.name = $scope.meetupName;
                    createMeetupResource.date = new Date($scope.meetupDate);
                    createMeetupResource.fromTime = $scope.meetupFromTime;
                    createMeetupResource.toTime = $scope.meetupToTime;
                    createMeetupResource.venue = $scope.meetupVenue;

                    createMeetupResource.$save(function(result){
                        $scope.meetupName = '';
                        socket.emit('meetup added',result);
                        $scope.meetups.push(result);
                        $location.path("/meetup/")
                    });
                }
            }
            
            $scope.reset = function(){
                $scope.$broadcast('show-errors-reset');
                $scope.meetupName = "";
                $scope.meetupDate = "";
                $scope.meetupFromTime = "";
                $scope.meetupToTime = "";
                $scope.meetupVenue = "";
                 $location.path("/meetup/create/")
            }
               
            
            $scope.findMeetup = function(_id){
                $scope.meetupUpdateService = new MeetupUpdateService();
                $scope.meetupUpdateService.$get({id:_id},function(result){
                     $scope.meetup = result;
                }); 
            }
            
            $scope.updateMeetup = function(_id){
                $scope.meetupUpdateService = new MeetupUpdateService();
                $scope.meetupUpdateService.name = $scope.meetup.name;
                $scope.meetupUpdateService.$update({id:_id},function(result){
                        socket.emit('meetup updated',result);
                    $location.path("/meetup/")
                });
            }
            
            $scope.getMeetup = function(_id){
                $scope.meetupUpdateService.$get({id : _id},function(result){
                    $scope.meetup = result;
                    $location.path("/meetup/"+_id+"/")
                });
                $scope.meetup
            }
            
            $scope.deleteMeetup = function(_id){
                $scope.meetupUpdateService.$delete({id: _id},function(result){
                     socket.emit('meetup deleted',result);
                    $location.path("/meetup/")
                });
            }
        }                                                         
]);