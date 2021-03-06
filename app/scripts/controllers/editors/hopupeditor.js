'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:HopupeditorCtrl
 * @description
 * # HopupeditorCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('HopupEditorCtrl', ['$scope', 'hopups', '$mdDialog', '$q', function ($scope, hopups, $mdDialog, $q) {
    var site = $scope.site;

      this.getActionName = function(actionId){
        var actions = $scope.site.actions;
        for (var action in actions){
          if (actions[action]._id == actionId){
            return actions[action].name;
          }
        }
        return 'not found';
      }

      this.getEventName = function(eventId){
        var events = $scope.site.events;
        for (var event in events){
          if (events[event]._id == eventId){
            return events[event].name;
          }
        }
        return 'not found';
      }

      this.removeSegment = function(id){
        var index = $scope.site.selected.segments.indexOf(id);
        if (index > -1){
          $scope.site.selected.segments.splice(index, 1);
        }
      }

      this.removeAction = function(id){
        var index = $scope.site.selected.actions.indexOf(id);
        if (index > -1){
          $scope.site.selected.actions.splice(index, 1);
        }
      }

      this.removeEvent = function(id){
        var index = $scope.site.selected.events.indexOf(id);
        if (index > -1){
          $scope.site.selected.events.splice(index, 1);
        }
      }

      this.responseTypes = [
        {display: 'template', value: 'template', code: 'template'},
        {display: 'html', value: 'html', code: 'html'}
      ];

      this.responseDataLocation = [
        {display: 'code', value: 'code', code: 'code'},
        {display: 'uri', value: 'uri', code: 'uri'}
      ];

      this.querySearch = function(query) {
        var results = query ? this.responseTypes.filter( this.createFilterFor(query) ) : [];
        var deferred = $q.defer();
        $timeout(function () {
          deferred.resolve( results );
        }, Math.random() * 1000, false);
        return deferred.promise;
      }

      this.createFilterFor = function(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(state) {
          return (state.value.indexOf(lowercaseQuery) === 0);
        };
      }

      this.add = function(site) {

          //if its new we have to set this
          site.selected.siteId = site.siteId

          hopups.update(site.selected, 'hopups').then(function(){
            hopups.fetch($scope.site.siteId, 'hopups').then( function(hopups) {
              $scope.site.hopups.length =0; // Cheeky way to empty the array.
              Array.prototype.push.apply($scope.site.hopups, hopups);
            });
          });

      }

      this.addSegment = function() {
        var dlg = $mdDialog.alert({
          templateUrl: 'views/dialogs/selectsegment.html',
          controller: ['$scope', '$window', function DialogController($scope, $window) {
            $scope.site = site;

            this.closeDialog= function(segment) {
              if (!site.selected.segments){
                site.selected.segments = [];
              }
                site.selected.segments.push(segment._id);
                $mdDialog.hide();
            };
          }],
          controllerAs: 'vm'
        });
        $mdDialog.show( dlg );
      };

      this.addAction = function() {
        var dlg = $mdDialog.alert({
          templateUrl: 'views/dialogs/selectaction.html',
          controller: ['$scope', '$window', function DialogController($scope, $window) {
            $scope.site = site;

            this.closeDialog= function(action) {
              if (!site.selected.actions){
                site.selected.actions = [];
              }
              site.selected.actions.push(action._id);
                $mdDialog.hide();
            };
          }],
          controllerAs: 'vm'
        });
        $mdDialog.show( dlg );
      };


      this.addEvent = function() {
        var dlg = $mdDialog.alert({
          templateUrl: 'views/dialogs/selectevent.html',
          controller: ['$scope', '$window', function DialogController($scope, $window) {
            $scope.site = site;

            this.closeDialog= function(event) {
              if (!site.selected.events){
                site.selected.events = [];
              }
                site.selected.events.push(event._id);
                $mdDialog.hide();
            };
          }],
          controllerAs: 'vm'
        });
        $mdDialog.show( dlg );
      };
  }]);
