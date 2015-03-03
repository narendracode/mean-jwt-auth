var module = angular.module('meetup.services',['ngResource']);

module.factory('MeetupUpdateService',function($resource){
    return $resource('meetup/:id', 
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