'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:SegmenteditorCtrl
 * @description
 * # SegmenteditorCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('SegmentEditorCtrl', [ '$scope', 'hopups', '$q', function ($scope, hopups, $q) {

      this.listenTypes = [
        {display: 'Inactive', value: 'inactive', code: 'inactive'},
        {display: 'Interest', value: 'interest', code: 'interest'},
        {display: 'Visits', value: 'visits', code: 'visits'},
        {display: 'Query String Param', value: 'querystring', code: 'querystring'},
        {display: 'Client Variable', value: 'clientvariable', code: 'clientvariable'},
      ];

      this.querySearch = function(query) {
        var results = query ? this.listenTypes.filter( this.createFilterFor(query) ) : [];
        var deferred = $q.defer();
        deferred.resolve( results );
        return deferred.promise;
      }

      this.createFilterFor = function(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
          return (state.value.indexOf(lowercaseQuery) === 0);
        };
      }

      this.add = function(site) {
          //we check if the dropdown has been used to change the event value
          if (site.selected.listen && site.selected.listen.value){
            site.selected.listen = site.selected.listen.value;
          }

          site.selected.siteId = site.siteId

          hopups.update(site.selected, 'segments').then(function(){
            hopups.fetch($scope.site.siteId, 'segments').then( function(segments) {
              $scope.site.segments.length =0; // Cheeky way to empty the array.
              Array.prototype.push.apply($scope.site.segments, segments);
            });
          });

      }

  }]);
