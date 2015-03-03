angular.module('chats',['ngResource','angularMoment','ui.router']);

angular.module('chats').config(['$stateProvider','$urlRouterProvider',
              function($stateProvider,$urlRouterProvider){
                     $urlRouterProvider.otherwise("/");
                     $stateProvider
                        .state('chat',{
                                  url: "/chat/",
                                  templateUrl: 'app/chats/chat.tpl.html',
                                  controller: 'ChatsController'
                        });                               
              }
]);

angular.module('chats').factory('chatsocket',function(){
    var socket = io.connect("http://192.168.1.106:3000/chat");
    return socket;
});

angular.module('chats').controller('ChatsController',['$scope','$resource','$state','$location','chatsocket',
            function($scope,$resource,$state,$location,chatsocket){
                $scope.chats = [];
                $scope.send = function(){
                    $scope.chats.push({message: $scope.message});
                    chatsocket.emit('send',{message: $scope.message});
                    $scope.message = "";
                }    
                
                chatsocket.on('chatmessage',function(data){
                    console.log("##### message emit received: "+JSON.stringify(data));
                    if(data.message){
                            $scope.chats.push(data);
                    }
                    $scope.$apply();
                });
            }
]);