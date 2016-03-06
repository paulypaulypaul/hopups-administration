'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:ActioneditorCtrl
 * @description
 * # ActioneditorCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('ActionEditorCtrl', ['$scope', 'hopups', function ($scope, hopups) {


    this.getSegmentName = function(segmentId){
          var segments = $scope.site.segments;
          for (var segment in segments){
            if (segments[segment]._id == segmentId){
              return segments[segment].listen + ' : ' + segments[segment].tag + ' : ' + segments[segment].threshold;
            }
          }
          return 'not found';
        }

        this.removeSegment = function(segmentId){
          var index = $scope.site.selected.segments.indexOf(segmentId);
          if (index > -1){
            $scope.site.selected.segments.splice(index, 1);
          }
        }

        this.responseTypes = [
          {display: 'Iframe in dialog', value: 'template', code: 'template'},
          {display: 'Code Append', value: 'html', code: 'html'}
        ];

        this.responseDataLocation = [
          {display: 'Self Code', value: 'code', code: 'code'},
          {display: 'URI', value: 'uri', code: 'uri'},
          {display: 'Pre Defined Template', value: 'predefined', code: 'predefined'},
        ];

        this.responsePredefinedTemplate = [
          {display: 'Left Slide', value: 'left', code: 'left'},
          {display: 'Right Slide', value: 'right', code: 'right'},
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

        this.getTemplateIfRequired = function(selected){
          var deferred = $q.defer();

          if (site.selected.responsePredefinedTemplate){
            if (site.selected.responsePredefinedTemplate == 'left'){

                var templateUrl = $sce.getTrustedResourceUrl('/src/views/hopups/actiontemplates/slidein.html');

                $templateRequest(templateUrl).then(function(template) {
                // template is the HTML template as a string

                // Let's put it into an HTML element and parse any directives and expressions
                // in the code. (Note: This is just an example, modifying the DOM from within
                // a controller is considered bad style.)
                var compiledHTMLString = $interpolate(template)(selected);

                selected.responsedata = compiledHTMLString

                deferred.resolve(selected);

                }, function() {
                  deferred.resolve(selected);
                });
            }
          } else {
            deferred.resolve(selected);
          }


          return deferred.promise;
        }

        this.add = function(site) {
            //if its new we have to set this
            site.selected.siteId = site.siteId

            this.getTemplateIfRequired(site.selected).then(function(selected){
              hopups.update(site.selected, 'actions').then(function(){
                hopups.fetch($scope.site.siteId, 'actions').then( function(actions) {
                  $scope.site.actions.length =0; // Cheeky way to empty the array.
                  Array.prototype.push.apply($scope.site.actions, actions);
                });
              });
            })
        }

        this.addSegment = function() {
          var dlg = $mdDialog.alert({
            templateUrl: './src/views/hopups/dialogs/selectsegment.html',
            controller: ['$scope', '$window', function DialogController($scope, $window) {
              $scope.site = site;
              console.log($scope.site);

              this.closeDialog= function(segment) {
                  site.selected.segments.push(segment._id);
                  $mdDialog.hide();
              };
            }],
            controllerAs: 'vm'
          });
          $mdDialog.show( dlg );
        };

  }]);
