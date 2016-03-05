'use strict';

/**
 * @ngdoc service
 * @name adminApp.hopups
 * @description
 * # hopups
 * Service in the adminApp.
 */
angular.module('adminApp')
  .service('hopups', ['$http', '$q', 'ENV', function ($http, $q, ENV) {
    this.baseuri = ENV.apiEndpoint + '/';
    this.headers = {"headers":{"Content-Type":"application/json"}};

    this.fetchSites = function(siteId) {
      var deferred = $q.defer();
      var url = this.baseuri + 'sites';
      if (siteId){
        url += '/' + siteId;
      }
      $http.get(url, this.headers)
           .error(function(msg) {
              deferred.reject(msg);
           })
           .success(function(data){
              //is we ask for one site we remove the array
              if (siteId){
                data = data[0];
              }
              deferred.resolve(data);
           });
      return deferred.promise;
    };

    this.updateSite = function(site) {
      var deferred = $q.defer();
      $http.post(this.baseuri + 'sites', site, this.headers)
           .error(function(msg) {
              deferred.reject(msg);
           })
           .success(function(data){
              deferred.resolve(data);
           });
      return deferred.promise;
    };

    this.fetch = function(siteId, type, searchObject){
      var deferred = $q.defer();
      var so = searchObject || {};
      $http.get(this.baseuri + 'sites/' + siteId + '/' + type, {params: so}, this.headers)
           .error(function(msg) {
              deferred.reject(msg);
           })
           .success(function(data){
              deferred.resolve(data);
           });
      return deferred.promise;
    };

    this.update = function(thing, type){
      var deferred = $q.defer();
      $http.post(this.baseuri + 'sites/' + thing.siteId + '/' + type, thing, this.headers)
           .error(function(msg) {
              deferred.reject(msg);
           })
           .success(function(data){
              deferred.resolve(data);
           });
      return deferred.promise;
    };

    this.delete = function(thing, type){
      var deferred = $q.defer();
      $http.delete(this.baseuri + 'sites/' + thing.siteId + '/' + type + '/' + thing._id, this.headers)
           .error(function(msg) {
              deferred.reject(msg);
           })
           .success(function(data){
              deferred.resolve(data);
           });
      return deferred.promise;
    };

  }]);
