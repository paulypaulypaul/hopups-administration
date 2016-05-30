'use strict';

/**
 * @ngdoc function
 * @name adminApp.controller:ChartsHopupchartCtrl
 * @description
 * # ChartsHopupchartCtrl
 * Controller of the adminApp
 */
angular.module('adminApp')
  .controller('HopupChartCtrl', ['$scope', '$timeout', function ($scope, $timeout) {


    this.getActionSessionDataForHopup = function(hopup){
      console.log('getActionSessionDataForHopup');
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
      console.log('getActionSessionDataForAction');
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
      console.log('getActionSessionDataForAction');
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
        isStacked: !$scope.simple,
        legend: { position: "none" },
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

    var totals = {};



    this.selectHopup = function(hopup) {

      totals = {};

      //have to do this for some reason to get thye hopup in the range by loop below
      this.selectedHopup = hopup;

      $scope.chartObjectDay = this.buildChartData(hopup, chartObjectDayColumns, chartObjectDayOptions, 'days', 'day', 7, 'dddd');

    //  $scope.chartObjectHour = this.buildChartData(hopup, chartObjectHourColumns, chartObjectHourOptions, 'hours', 'hour', 24, 'HH');

    //  $scope.chartObjectMin = this.buildChartData(hopup, chartObjectMinColumns, chartObjectMinOptions, 'minute', 'minute', 60, 'mm');

      $scope.calcStatSigString = this.calcStatSig();
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
      chartObjectOptions.vAxis.viewWindow.max = chartRowsAndHighestNumber.highestNumber > 0 ? chartRowsAndHighestNumber.highestNumber : 1 ;

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

          if (!totals[self.selectedHopup.actions[i]]){
            totals[self.selectedHopup.actions[i]] = {};
            totals[self.selectedHopup.actions[i]].events = {};
            totals[self.selectedHopup.actions[i]].total = 0;
          }

          if (actionMetrics[self.selectedHopup.actions[i]]){
            var actionMetric = actionMetrics[self.selectedHopup.actions[i]];
            row.push({
              v: actionMetric.count,
              f: "Action delivered " + actionMetric.count + "times"
            });
            totals[self.selectedHopup.actions[i]].total += actionMetric.count;
         } else {
            row.push({v: 0});
         }

         var action = self.getActionById(self.selectedHopup.actions[i]);

         for(var j=0; j < action.events.length; j++){
           var event = action.events[j];

           if (actionMetrics[action._id] && actionMetrics[action._id].events[event]){

              if (!totals[self.selectedHopup.actions[i]].events[event]){
                totals[self.selectedHopup.actions[i]].events[event] = 0;
              }

             totals[self.selectedHopup.actions[i]].events[event] += actionMetrics[action._id].events[event];

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

    this.calcStatSig = function(){

      var control_trials = null;
      var variation_trials = null;
      var control_conversions = null;
      var variation_conversions = 0;
      //assume only to actions perhopup
      for (var key in totals){

          if (!control_trials){
            control_trials = totals[key].total;
            for (var key2 in totals[key].events){
              if (!control_conversions){
                control_conversions = totals[key].events[key2] || 0;
              }
            }
          }

          else if (!variation_trials){
            variation_trials = totals[key].total;
            for (var key2 in totals[key].events){
              if (!variation_conversions){
                variation_conversions = totals[key].events[key2] || 0;
              }
            }
          }
      }

      return calculate(control_trials, variation_trials, control_conversions, variation_conversions)
    }

    function NormalP(x) {
        var d1 = 0.0498673470
          , d2 = 0.0211410061
          , d3 = 0.0032776263
          , d4 = 0.0000380036
          , d5 = 0.0000488906
          , d6 = 0.0000053830;
        var a = Math.abs(x);
        var t = 1.0 + a * (d1 + a * (d2 + a * (d3 + a * (d4 + a * (d5 + a * d6)))));
        t *= t;
        t *= t;
        t *= t;
        t *= t;
        t = 1.0 / (t + t);
        if (x >= 0)
            t = 1 - t;
        return t;
    }

    function calculate(control_trials, variation_trials, control_conversions, variation_conversions) {
        var c_t = control_trials;
        var v_t = variation_trials;
        var c_c = control_conversions;
        var v_c = variation_conversions;

        //if (c_t < 1) {
        //    return ("There must be at least 15 control trials for this tool to produce any results.");
        //}
        //if (v_t < 1) {
        //    return ("There must be at least 15 variation trials for this tool to produce any results.");
        //}
        var c_p = c_c / c_t;
        var v_p = v_c / v_t;
        var std_error = Math.sqrt((c_p * (1 - c_p) / c_t) + (v_p * (1 - v_p) / v_t));
        var z_value = (v_p - c_p) / std_error;
        var p_value = NormalP(z_value);
        if (p_value > 0.5)
            p_value = 1 - p_value;
        //p_value = Math.round(p_value * 1000) / 1000;
        //$("#p_value").val(p_value);
        if (p_value < 0.05) {
            return 'yes, p_value = ' + p_value;
        }
        else {
            return 'no, p_value = ' + p_value;
        }
    }

    var self = this;
    $timeout(function(){
      self.selectHopup($scope.hopup);
    }, 500 * $scope.timeout);

  }]);
