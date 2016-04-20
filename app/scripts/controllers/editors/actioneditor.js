'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:ActioneditorCtrl
 * @description
 * # ActioneditorCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('ActionEditorCtrl', ['$scope', 'hopups', '$q', '$sce', '$templateRequest', '$interpolate', '$mdDialog',
    function ($scope, hopups, $q, $sce, $templateRequest, $interpolate, $mdDialog) {

    var site = $scope.site;

    this.getEventName = function(eventId){
      var events = $scope.site.events;
      for (var event in events){
        if (events[event]._id == eventId){
          return events[event].name;
        }
      }
      return 'not found';
    }

        this.removeEvent = function(Id){
          var index = $scope.site.selected.events.indexOf(Id);
          if (index > -1){
            $scope.site.selected.events.splice(index, 1);
          }
        }

        this.responseTypes = [
          {display: 'Iframe in dialog', value: 'template', code: 'template'},
          {display: 'Code Append', value: 'html', code: 'html'},
          {display: 'Element Replace', value: 'html-replace', code: 'html-replace'}
        ];

        this.responseDataLocation = [
          {display: 'Self Code', value: 'code', code: 'code'},
          {display: 'URI', value: 'uri', code: 'uri'},
          {display: 'Pre Defined Template', value: 'predefined', code: 'predefined'},
        ];

        this.responsePredefinedTemplate = [
          {display: 'Left Slide', value: 'left', code: 'left'},
          {display: 'Right Slide', value: 'right', code: 'right'},
          {display: 'Target Element', value: 'target', code: 'target'},
          {display: 'Left Slide Empty', value: 'left-empty', code: 'left-empty'},
          {display: 'Left Slide Empty Stay', value: 'left-empty-stay', code: 'left-empty-stay'},
          {display: 'Center Panel', value: 'center-panel', code: 'center-panel'},
          {display: 'Two Column', value: 'two-column', code: 'two-column'},
        ];

        this.responsePredefinedTemplateColor = [
          {display: '#E37568', value: '#E37568', code: '#E37568'},
          {display: '#e84c6f', value: '#e84c6f', code: '#e84c6f'},
          {display: '#ff8080', value: '#ff8080', code: '#ff8080'},
          {display: '#DE935F', value: '#DE935F', code: '#DE935F'},
          {display: '#2F5551', value: '#2F5551', code: '#2F5551'},
          {display: '#20D3EF', value: '#20D3EF', code: '#20D3EF'},
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

          if (site.selected.responsedatafrom === 'predefined'){
              var templateUrl
              if (site.selected.templateAttributes.side == 'left'){
                templateUrl = $sce.getTrustedResourceUrl('views/actiontemplates/slidein-left.html');
              } else if (site.selected.templateAttributes.side == 'right'){
                templateUrl = $sce.getTrustedResourceUrl('views/actiontemplates/slidein-right.html');
              } else if (site.selected.templateAttributes.side == 'target'){
                templateUrl = $sce.getTrustedResourceUrl('views/actiontemplates/target.html');
              } else if (site.selected.templateAttributes.side == 'left-empty'){
                templateUrl = $sce.getTrustedResourceUrl('views/actiontemplates/slidein-left-empty.html');
              } else if (site.selected.templateAttributes.side == 'left-empty-stay'){
                templateUrl = $sce.getTrustedResourceUrl('views/actiontemplates/slidein-left-empty-stay.html');
              } else if (site.selected.templateAttributes.side == 'two-column'){
                templateUrl = $sce.getTrustedResourceUrl('views/actiontemplates/two-column.html');
              } else if (site.selected.templateAttributes.side == 'center-panel'){
                templateUrl = $sce.getTrustedResourceUrl('views/actiontemplates/center-panel.html');
              }


              $templateRequest(templateUrl).then(function(template) {

              // template is the HTML template as a string

              if (!selected.templateAttributes.color){
                selected.templateAttributes.color = '#ff8080';
              }

              // Let's put it into an HTML element and parse any directives and expressions
              // in the code. (Note: This is just an example, modifying the DOM from within
              // a controller is considered bad style.)
              var compiledHTMLString = $interpolate(template)(selected);

              selected.responsedata = compiledHTMLString

              deferred.resolve(selected);

              }, function() {
                deferred.resolve(selected);
              });
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
