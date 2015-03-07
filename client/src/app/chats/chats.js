angular.module('chats',['ngResource','angularMoment','ui.router']);

angular.module('chats').config(['$stateProvider','$urlRouterProvider',
              function($stateProvider,$urlRouterProvider){
                     $urlRouterProvider.otherwise("/");
                     $stateProvider
                        .state('chat',{
                                  url: "/chat/",
                                  templateUrl: 'app/chats/chat.tpl.html',
                                  controller: 'ChatsController',
                                  data: {
                                        authRequired: true,
                                        access: ['user','admin']
                                  }
                        });                               
              }
]);

angular.module('chats').run(function($rootScope,$location){
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


angular.module('chats').factory('chatsocket',function(){
    var socket = io.connect("http://192.168.1.3:3000/chat");
    return socket;
});

angular.module('chats').controller('ChatsController',['$scope','$resource','$state','$location','chatsocket','$rootScope',
            function($scope,$resource,$state,$location,chatsocket,$rootScope){
                var ChatResource = $resource('/chat');
                var objDiv = document.getElementById("chat-message-panel");
                var chatResource = new ChatResource();
                $scope.chats = [];
                $scope.send = function(){
                    chatsocket.emit('typing:stopped',{message: $rootScope.currentUser.name + " stopped typing.."});
                   
                    chatResource.message = $scope.message;
                    chatResource.create_by = $rootScope.currentUser.name;
                    chatResource.$save(function(result){
                        console.log("###### response from chat res : "+JSON.stringify(result));
                        $scope.chats.push({message: $scope.message, create_by: $rootScope.currentUser.name});
                        chatsocket.emit('send',{message: $scope.message, create_by:$rootScope.currentUser.name});
                        objDiv.scrollTop = objDiv.scrollHeight;
                        $scope.message = "";
                    });
                }    
                
                chatsocket.on('chatmessage',function(data){
                    if(data.message){
                            $scope.chats.push(data);
                        objDiv.scrollTop = objDiv.scrollHeight;
                    }
                    $scope.$apply();
                });
                
                $scope.emitTypingEvent = function(){
                    if($scope.message){
                        chatsocket.emit('typing',{message: $rootScope.currentUser.name + " is typing.."});
                    }else{
                        chatsocket.emit('typing:stopped',{message: $rootScope.currentUser.name + " stopped typing.."});
                    }
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