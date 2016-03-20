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

    this.getEventById = function(id){
      for (var i = 0; i < $scope.site.events.length; i++){
        var event = $scope.site.events[i];
        if (event._id === id){
          return event;
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
      "cols": [],
      "rows": []};
    $scope.chartObjectDay.options = {
        'title': 'Hopups Week'
    };
    var chartObjectDayColumns = [
      {id: "t", label: "Day", type: "string"},
      {id: "d", label: "Delivered", type: "number"}
    ];

    $scope.chartObjectHour = {};
    $scope.chartObjectHour.type = "ColumnChart";
    $scope.chartObjectHour.data = {
      "cols": [],
      "rows": []};
    $scope.chartObjectHour.options = {
        'title': 'Hopups Past 2 Days'
    };
    var chartObjectHourColumns = [
      {id: "t", label: "Day", type: "string"},
      {id: "d", label: "Delivered", type: "number"}
    ];

    $scope.chartObjectMin = {};
    $scope.chartObjectMin.type = "ColumnChart";
    $scope.chartObjectMin.data = {
      "cols": [],
      "rows": []};
    $scope.chartObjectMin.options = {
        'title': 'Hopups Past 2 Hours'
    };
    var chartObjectMinColumns = [
      {id: "t", label: "Min", type: "string"},
      {id: "d", label: "Delivered", type: "number"}
    ];

    this.buildColumnsFromHopup = function(hopup){
      var cols = []
      for (var i = 0; i < hopup.events.length; i++){

          var event = this.getEventById(hopup.events[i]);

          cols.push({id: "r", label: "Responded " + event.name  + ' ' + hopup.events[i], type: "number"});
      }
      return cols;
    };

    this.selectHopup = function(hopup) {
      $scope.site.selectedHopup = hopup;

      var extraColumns = this.buildColumnsFromHopup(hopup);

      $scope.chartObjectDay.data.cols = chartObjectDayColumns;
      this.createChart(hopup, $scope.chartObjectDay, extraColumns, 'days', 'day', 7, 'dddd');

      $scope.chartObjectHour.data.cols = chartObjectHourColumns;
      this.createChart(hopup, $scope.chartObjectHour, extraColumns, 'hours', 'hour', 48, 'HH');

      $scope.chartObjectMin.data.cols = chartObjectMinColumns;
      this.createChart(hopup, $scope.chartObjectMin, extraColumns, 'minute', 'minute', 120, 'mm');
    };

    this.createChart = function(hopup, chartobject, extraColumns, timeSlicePl, timeSlice, range, format){
      var self = this;

      chartobject.data.cols = chartobject.data.cols.concat(extraColumns);
      chartobject.data.rows.length = 0;

      var actionSessionDataForHopup = this.getActionSessionDataForHopup(hopup);
      var start   = moment().subtract(range, timeSlicePl);
      var end = moment();

      var range = moment.range(start, end);

      range.by(timeSlicePl, function(slice) {
        console.log('range', slice);
        var matched = [];
        var actionSesionData = [];
        var actionSesionDataIndexed = {};

        for(var i =0; i < actionSessionDataForHopup.length; i++){

          //get action sessions that are the same as the start of the time slice
          if (slice.startOf(timeSlice).isSame(moment(actionSessionDataForHopup[i].date).startOf(timeSlice))){

            var actionSesionDataForHopupInstance = self.getSessionDataFromActionInstance(actionSessionDataForHopup[i]);
            matched.push(actionSessionDataForHopup[i]);

            for (var j = 0; j < actionSesionDataForHopupInstance.length; j++){
              //lets segemnts the actionsessiondata by the event id that caused them
              if (!actionSesionDataIndexed[actionSesionDataForHopupInstance[j].event]){
                actionSesionDataIndexed[actionSesionDataForHopupInstance[j].event] = [];

              }
              actionSesionDataIndexed[actionSesionDataForHopupInstance[j].event].push(actionSesionData[j]);
              actionSesionData.concat(actionSesionDataForHopupInstance)
            }
          }
        }

        var row = [
            {v: slice.format(format)},
            {v: matched.length}
        ];

        //here we apply the number of sesion data to the row for the chartObject
        //but atm we are just  replying on the ids somehow syncing - needs to better.
        for (var key in actionSesionDataIndexed){
          row.push({v: actionSesionDataIndexed[key].length})
        }

        var chartObject = {c: row}
        chartobject.data.rows.push(chartObject);

      });

    }

    this.displayHopups = function(){
      return !!$scope.site.selectedHopup;
    }

  }]);
