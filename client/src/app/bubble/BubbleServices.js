
var module = angular.module('bubble.services',['ngResource']);

module.factory('BubbleService',function($resource){
    return $resource('bubble/:id',
           {
              id: '@id'
           },
           {
              'update': { method:'PUT' }
           },
           {
              'get': { method: 'GET', isArray: false }
           },
           {
               'delete': { method: 'DELETE'}
           }
   );
});
