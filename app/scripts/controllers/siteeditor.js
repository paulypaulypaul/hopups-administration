'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:SiteeditorCtrl
 * @description
 * # SiteeditorCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('SiteEditorCtrl', ['$scope', 'hopups', 'ENV', function ($scope, hopups, ENV) {

    this.widgetEndpoint = ENV.widgetEndpoint;

    this.add = function(site) {
      hopups.updateSite(site.siteDetails).then(function(){
          hopups.fetchSites(site.siteDetails._id).then( function(siteDetails) {
            $scope.site.siteDetails = siteDetails;
          });
      });
    }

  }]);
