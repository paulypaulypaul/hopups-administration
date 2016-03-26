'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:AnalyseCtrl
 * @description
 * # AnalyseCtrl
 * Controller of the adminApp
 */

//this shoulnt be here - just here so we can use the options converter for the new material charts
google.load('visualization', '1.1', {packages:['bar']});

(function(){
    angular.module('googlechart')
        .value('googleChartApiConfig', {
            version: '1.1',
            optionalSettings: {
                packages: ['bar', 'line']
            }
        });
})();

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
      actionsessiondatatimeseries: [],
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
      hopups.fetch($scope.site.siteId, 'actionsessiondatatimeseries').then( function(actionsessiondatatimeseries) {
        $scope.site.actionsessiondata.length = 0; // Cheeky way to empty the array.
        Array.prototype.push.apply($scope.site.actionsessiondatatimeseries, actionsessiondatatimeseries);
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

  /*  var data = new google.visualization.DataTable();
    data.addColumn('string', 'Day');
    data.addColumn('number', 'Delivered - hopup1');
    data.addColumn('number', 'Action - hopup1');
    data.addColumn('number', 'Delivered - hopup2');
    data.addColumn('number', 'Action - hopup2');

    data.addRows([
        ['2001', 1, 2, 3, 4],
        ['2002', 1, 1, 1, 1],
        ['2003', 2, 2, 2, 2],
        ['2004', 3, 3, 3, 3]
    ]);

    // Set chart options
    var options = {
        isStacked: true,
        width: '100%',
        height: '100%',
        axisTitlesPosition: 'out',
        chart: {
            title: 'Year-by-year coffee consumption',
            subtitle: 'This data is not real'
        },
        series: {
            0: {
                targetAxisIndex: 0
            },
            1: {
                targetAxisIndex: 0
            },
            2: {
                targetAxisIndex: 1
            },
            3: {
                targetAxisIndex: 1
            }
        }
    };

    var chart = new google.charts.Bar(document.getElementById('chartdiv'));
    chart.draw(data, google.charts.Bar.convertOptions(options));*/

    $scope.chartObjectDay = {};
    var chartObjectDayOptions = {
        isStacked: true,
        axisTitlesPosition: 'out',
        chart: {
            title: 'Hopups last week',
            subtitle: 'Seperated by action delivered'
        },
        height: '400',
        vAxis:{
           viewWindow:{
              min:0
           }
        }
    };
    var chartObjectDayColumns = [
      {id: "t", label: "Day", type: "string"},
    ];

    $scope.chartObjectHour = {};
    var chartObjectHourOptions = {
        isStacked: true,
        axisTitlesPosition: 'out',
        chart: {
            title: 'Hopups ast day',
            subtitle: 'Seperated by action delivered'
        },
        height: '400',
        vAxis:{
           viewWindow:{
              min:0
           }
        }
    };
    var chartObjectHourColumns = [
      {id: "t", label: "Hour", type: "string"},
    ];


    $scope.chartObjectMin = {};
    var chartObjectMinOptions = {
        isStacked: true,
        axisTitlesPosition: 'out',
        chart: {
            title: 'Hopups last hour',
            subtitle: 'Seperated by action delivered'
        },
        height: '400',
        vAxis:{
           viewWindow:{
              min:0
           }
        }
    };
    var chartObjectMinColumns = [
      {id: "t", label: "Min", type: "string"},
    ];

    this.selectHopup = function(hopup) {
      $scope.site.selectedHopup = hopup;

      //have to do this for some reason to get thye hopup in the range by loop below
      this.selectedHopup = hopup;

      $scope.chartObjectDay = this.buildChartData(hopup, chartObjectDayColumns, chartObjectDayOptions, 'days', 'day', 7, 'dddd');

      $scope.chartObjectHour = this.buildChartData(hopup, chartObjectHourColumns, chartObjectHourOptions, 'hours', 'hour', 24, 'HH');

      $scope.chartObjectMin = this.buildChartData(hopup, chartObjectMinColumns, chartObjectMinOptions, 'minute', 'minute', 60, 'mm');

    };

    this.buildChartData = function(hopup, chartObjectColumns, chartObjectOptions, timeSlicePl, timeSlice, range, format){

      var chartData = {
        data: {},
        options: {},
        type: "google.charts.Bar"
      };

      //set columns up each time as each hopup could have a different number of columns
      chartData.data.cols = chartObjectColumns;
      var extraColumns = this.buildColumnsFromHopup(hopup);
      chartData.data.cols = chartData.data.cols.concat(extraColumns);

      var chartRowsAndHighestNumber = this.createChartRows(hopup, timeSlicePl, timeSlice, range, format);

      chartData.data.rows = chartRowsAndHighestNumber.rows

      chartObjectOptions.series = this.buildSeriesFromHopup(hopup);
      chartObjectOptions.vAxis.viewWindow.max = chartRowsAndHighestNumber.highestNumber;

      chartData.options = google.charts.Bar.convertOptions(chartObjectOptions);


      return chartData;

    }

    this.buildColumnsFromHopup = function(hopup){
      var cols = [];
      for (var i = 0; i < hopup.actions.length; i++){
          var action = this.getActionById(hopup.actions[i]);
          cols.push({id: "r"+ i, label: "Action " + action.name /* + ' ' + hopup.actions[i]*/, type: "number"});

          for (var j = 0; j < action.events.length; j++){
            var event = this.getEventById(action.events[j]);
            cols.push({id: "r"+ i + j, label: "Responded " + event.name /* + ' ' + action.events[j]*/, type: "number"});
          }
      }
      return cols;
    };

    this.buildSeriesFromHopup = function(hopup){
      var options = {};
      var index = 0
      for (var i = 0; i < hopup.actions.length; i++){
          var action = this.getActionById(hopup.actions[i]);
          options[index++] = {
              targetAxisIndex: i
          };

          for (var j = 1; j < action.events.length + 1; j++){
            options[index++] = {
                targetAxisIndex: i
            };

          }
      }
      return options;
    };

    this.createChartRows = function(hopup, timeSlicePl, timeSlice, range, format){
      var self = this;
      var rows = [];

      var highestScore = 0;
      var actionSessionDataForHopup = this.getActionSessionDataForHopup(hopup);
      var start = moment().subtract(range, timeSlicePl);

      var end = moment();
      var hopup = {
        hopup: hopup
      };

      var range = moment.range(start, end);

      range.by(timeSlicePl, function(slice) {
        console.log('range', slice);

        var actionMetrics = {}
        var actionSesionDataIndexed = {};

        //loop around all action sessions for the hopup - this contains multiple actions if a hopup has multiple
        for(var i =0; i < actionSessionDataForHopup.length; i++){

          var asdfh = actionSessionDataForHopup[i];

          //get action sessions that are the same as the start of the time slice
          if (slice.startOf(timeSlice).isSame(moment(actionSessionDataForHopup[i].date).startOf(timeSlice))){

            if (!actionMetrics[asdfh.action]){
              actionMetrics[asdfh.action] = {
                count: 0,
                events: {},
              };
            }

            //increment count every time
            actionMetrics[asdfh.action].count++;

            var sessionDataFromActionInstance = self.getSessionDataFromActionInstance(actionSessionDataForHopup[i]);

            for (var j = 0; j < sessionDataFromActionInstance.length; j++){
              //lets segemnts the actionsessiondata by the event id that caused them
              if (!actionMetrics[asdfh.action].events[sessionDataFromActionInstance[j].event]){
                actionMetrics[asdfh.action].events[sessionDataFromActionInstance[j].event] = 0;
              }

              actionMetrics[asdfh.action].events[sessionDataFromActionInstance[j].event]++;
            }
          }
        }

        var row = [{v: slice.format(format)}];

        for(var i=0; i < self.selectedHopup.actions.length; i++){

          if (actionMetrics[self.selectedHopup.actions[i]]){
            var actionMetric = actionMetrics[self.selectedHopup.actions[i]];
            row.push({
              v: actionMetric.count,
              f: "Action delivered " + actionMetric.count + "times"
            });

         } else {
            row.push({v: 0});
         }

         var action = self.getActionById(self.selectedHopup.actions[i]);

         for(var j=0; j < action.events.length; j++){
           var event = action.events[j];

           if (actionMetrics[action._id] && actionMetrics[action._id].events[event]){
              row.push({
                v: actionMetrics[action._id].events[event],
                f: "Event triggered" + actionMetrics[action._id].events[event] + "times"
              })
           } else {
             row.push({v: 0});
           }
         }

        }

        rows.push({c: row});

        //calculate the set with the highest values
        for (var key in actionMetrics){
          var score = 0;
          var actionMetric = actionMetrics[key];
          score = actionMetric.count;

          for (var innerkey in actionMetric.events){
            var event = actionMetric.events[innerkey];
            score += event;
          }

          if (score > highestScore){
            highestScore = score;
          }

        }

      });

      return {
        rows: rows,
        highestNumber: highestScore
      }
    }

    this.displayHopups = function(){
      return !!$scope.site.selectedHopup;
    }

  }])
  .value('googleChartApiConfig', {
        version: '1.1',
        optionalSettings: {
          packages: ['bar'],
          language: 'en'
        }
      });
