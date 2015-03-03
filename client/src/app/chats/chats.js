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

angular.module('chats').controller('ChatsController',['$scope','$resource','$state','$location','chatsocket','$rootScope',
            function($scope,$resource,$state,$location,chatsocket,$rootScope){
               
                var ChatResource = $resource('/chat/');
                var objDiv = document.getElementById("chat-message-panel");

                $scope.chats = [];
                $scope.send = function(){
                    $scope.chats.push({message: $scope.message, create_by: $rootScope.currentUser.name});
                    chatsocket.emit('typing:stopped',{message: $rootScope.currentUser.name + " stopped typing.."});
                    chatsocket.emit('send',{message: $scope.message, create_by:$rootScope.currentUser.name});
                    
                    objDiv.scrollTop = objDiv.scrollHeight;
                    $scope.message = "";
                }    
                
                chatsocket.on('chatmessage',function(data){
                    console.log("##### message emit received: "+JSON.stringify(data));
                    if(data.message){
                            $scope.chats.push(data);
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }
                    $scope.$apply();
                });
                
                
                $scope.emitTypingEvent = function(){
                    console.log('emit typing.....');
                    chatsocket.emit('typing',{message: $rootScope.currentUser.name + " is typing.."});
                }
                
                chatsocket.on('typing',function(data){
                    $scope.typing = "typing....";
                    $scope.$apply();
                });
                
                chatsocket.on('typing:stopped',function(data){
                    $scope.typing ="";
                    $scope.$apply();
                });
                
                
            }
]);