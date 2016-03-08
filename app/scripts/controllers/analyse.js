'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:AnalyseCtrl
 * @description
 * # AnalyseCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('AnalyseCtrl', [ '$scope', 'hopups', '$stateParams', function ($scope, hopups, $stateParams) {


    $scope.site = {
      siteId: $stateParams.siteId,
      events: [],
      segments: [],
      actions: [],
      hopups: [],
      sessiondata: [],
      actionsessiondata: [],
      selectedHopup: null
    };

    function refresh() {
      hopups.fetch($scope.site.siteId, 'sessiondata').then( function(sessiondata) {
        $scope.site.sessiondata.length = 0; // Cheeky way to empty the array.
        Array.prototype.push.apply($scope.site.sessiondata, sessiondata);
      });
      hopups.fetch($scope.site.siteId, 'actionsessiondata').then( function(actionsessiondata) {
        $scope.site.actionsessiondata.length = 0; // Cheeky way to empty the array.
        Array.prototype.push.apply($scope.site.actionsessiondata, actionsessiondata);
      });
      hopups.fetch($scope.site.siteId, 'events').then( function(events) {
        $scope.site.events.length =0; // Cheeky way to empty the array.
        Array.prototype.push.apply($scope.site.events, events);
      });
      hopups.fetch($scope.site.siteId, 'segments').then( function(segments) {
        $scope.site.segments.length =0; // Cheeky way to empty the array.
        Array.prototype.push.apply($scope.site.segments, segments);
      });
      hopups.fetch($scope.site.siteId, 'actions').then( function(actions) {
        $scope.site.actions.length =0; // Cheeky way to empty the array.
        Array.prototype.push.apply($scope.site.actions, actions);
      });
      hopups.fetch($scope.site.siteId, 'hopups').then( function(hopups) {
        $scope.site.hopups.length =0; // Cheeky way to empty the array.
        Array.prototype.push.apply($scope.site.hopups, hopups);
      });

    }

    refresh();

    this.getActionSessionDataForHopup = function(hopup){
      if (hopup){
        var actionsessiondatas = [];
        for (var i = 0; i < $scope.site.actionsessiondata.length; i++){
          var actionsessiondata = $scope.site.actionsessiondata[i];
          if (actionsessiondata.hopup === hopup._id){
            actionsessiondatas.push(actionsessiondata);
          }
        }
        return actionsessiondatas;
      }
    };

    this.getActionSessionDataForAction = function(actionId){
      if (actionId){
        var actionsessiondatas = [];
        for (var i = 0; i < $scope.site.actionsessiondata.length; i++){
          var actionsessiondata = $scope.site.actionsessiondata[i];
          console.log(actionsessiondata.action, actionId);
          if (actionsessiondata.action === actionId){
            actionsessiondatas.push(actionsessiondata);
          }
        }
        return actionsessiondatas;
      }
    };



    this.getAction = function(actionsessiondata){
      var actions = [];
      for (var i = 0; i < $scope.site.actions.length; i++){
        var action = $scope.site.actions[i];
        if (action._id === actionsessiondata.action){
          actions.push(action);
        }
      }
      return actions;
    };

    this.getActionById = function(actionId){
      for (var i = 0; i < $scope.site.actions.length; i++){
        var action = $scope.site.actions[i];
        if (action._id === actionId){
          return action;
        }
      }
      return {name: 'not found'};
    };

    this.getSessionDataFromActionInstance = function(actionSessionData){
      var id = actionSessionData._id;
      var sessionDataItems = []
      for(var i =0; i < $scope.site.sessiondata.length; i++){
        var sessionDataItem = $scope.site.sessiondata[i];
        if (sessionDataItem.context.parent && sessionDataItem.context.parent == id){
          sessionDataItems.push(sessionDataItem);
        }

      }
      return sessionDataItems;
      //return 'none';
    }

    $scope.chartObjectDay = {};
    $scope.chartObjectDay.type = "ColumnChart";

    $scope.chartObjectDay.data = {
      "cols": [
        {id: "t", label: "Day", type: "string"},
        {id: "d", label: "Delivered", type: "number"},
        {id: "r", label: "Responded", type: "number"}
      ],
      "rows": []};

    $scope.chartObjectDay.options = {
        'title': 'Hopups Week'
    };

    $scope.chartObjectHour = {};
    $scope.chartObjectHour.type = "ColumnChart";

    $scope.chartObjectHour.data = {
      "cols": [
        {id: "t", label: "Day", type: "string"},
        {id: "d", label: "Delivered", type: "number"},
        {id: "r", label: "Responded", type: "number"}
      ],
      "rows": []};

    $scope.chartObjectHour.options = {
        'title': 'Hopups Past 2 Days'
    };

    $scope.chartObjectMin = {};
        $scope.chartObjectMin.type = "ColumnChart";

        $scope.chartObjectMin.data = {
          "cols": [
            {id: "t", label: "Min", type: "string"},
            {id: "d", label: "Delivered", type: "number"},
            {id: "r", label: "Responded", type: "number"}
          ],
          "rows": []};

        $scope.chartObjectMin.options = {
            'title': 'Hopups Past 2 Hours'
        };

    this.selectHopup = function(hopup) {
      $scope.site.selectedHopup = hopup;

      this.createChart(hopup, $scope.chartObjectDay, 'days', 'day', 7, 'dddd');
      this.createChart(hopup, $scope.chartObjectHour, 'hours', 'hour', 48, 'HH');
      this.createChart(hopup, $scope.chartObjectMin, 'minute', 'minute', 120, 'mm');
    };

    this.createChart = function(hopup, chartobject, timeSlicePl, timeSlice, range, format){
      var self = this;

      chartobject.data.rows.length = 0;

      var actionSessionData = this.getActionSessionDataForHopup(hopup);
      var start   = moment().subtract(range, timeSlicePl);
      var end = moment();

      var range = moment.range(start, end);

      range.by(timeSlicePl, function(slice) {
        var matched = [];
        var actionSesionData = [];

        for(var i =0; i < actionSessionData.length; i++){
          if (slice.startOf(timeSlice).isSame(moment(actionSessionData[i].date).startOf(timeSlice))){
              actionSesionData = actionSesionData.concat(self.getSessionDataFromActionInstance(actionSessionData[i]));
              matched.push(actionSessionData[i]);
          }
          //if (moment.diff(actionSessionData[i].date, 'days') === 0){
          //  matched.push(actionSessionData[i])
          //}
        }

        chartobject.data.rows.push({c: [
            {v: slice.format(format)},
            {v: matched.length},
            {v: actionSesionData.length},
        ]});

      });

    }

    this.displayHopups = function(){
      return !!$scope.site.selectedHopup;
    }




  }]);
