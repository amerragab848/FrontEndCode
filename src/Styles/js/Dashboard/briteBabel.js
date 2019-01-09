
let groupedBarDataHalf = {
  data:[
/*    */{stack: "green", value: 88.1, date: "Jan"},
        {stack: "green", value: 100, date: "Feb"},
      
        {stack: "grey", value: 60, date: "Jan"},
        {stack: "grey", value: 80, date: "Feb"},
      
        {stack: "green",  value: 140, date: "Mar"},
        {stack: "green",  value: 120, date: "Apr"},
      
        {stack: "grey",  value: 150, date: "Mar"},
        {stack: "grey",  value: 80, date: "Apr"},
      
        {stack: "green",  value: 150, date: "May"},
        {stack: "green", value: 70, date: "Jun"},
      
        {stack: "grey",  value: 170, date: "May"},
        {stack: "grey",  value: 40, date: "Jun"},
      
        {stack: "green",  value: 150, date: "Jul"},
        {stack: "green", value: 190, date: "Aug"},
      
        {stack: "grey", value: 140, date: "Jul"},
        {stack: "grey",  value: 120, date: "Aug"},
      
        {stack: "green", value: 100, date: "Sep"},
        {stack: "green",  value: 60, date: "Oct"},
      
        {stack: "grey",  value: 100, date: "Sep"},
        {stack: "grey",  value: 70, date: "Oct"},
      
        {stack: "green",  value: 80, date: "Nov"},
        {stack: "green",  value: 120, date: "Dec"},
      
        {stack: "grey", value: 190, date: "Nov"},
        {stack: "grey",  value: 80, date: "Dec"},
      
  ]
};
function createGroupedBarChartHalf() {
      var groupedBarChart = britecharts.groupedBar(),
        chartTooltip = britecharts.tooltip(),
        container = d3.select('.js-grouped-bar-chart-tooltip-container-Half'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer;
    let color = ["#dfe2e6", "#39bd3d "];
    groupedBarChart
      .width(containerWidth)
      .groupLabel('stack')
      .height(300)
        .nameLabel('date')
        .valueLabel('value')
      .isAnimated(true)
      .colorSchema(color)
      .grid('horizontal')

      .on('customMouseOver', function() {
      chartTooltip.show();
    })
      .on('customMouseMove', function(dataPoint, topicColorMap, x,y) {
      chartTooltip.update(dataPoint, topicColorMap, x, y);
    })
      .on('customMouseOut', function() {
      chartTooltip.hide();
    });
  
    container.datum(groupedBarDataHalf.data).call(groupedBarChart);
  
    chartTooltip
      .nameLabel('stack')
      .topicLabel('values')
      .dateLabel('key')
      .title('Title is Here')
    .shouldShowDateInTitle(false);

    tooltipContainer = d3.select('.js-grouped-bar-chart-tooltip-container-Half .metadata-group');
    tooltipContainer.datum([]).call(chartTooltip);
    
}
createGroupedBarChartHalf();
/*half*/

let groupedBarDataPredictedHalf = {
  data:[
/*    */{stack: "green", value: 88.1, date: "Jan"},
        {stack: "green", value: 100, date: "Feb"},
      
        {stack: "grey", value: 60, date: "Jan"},
        {stack: "grey", value: 80, date: "Feb"},
      
        {stack: "green",  value: 140, date: "Mar"},
        {stack: "green",  value: 120, date: "Apr"},
      
        {stack: "grey",  value: 150, date: "Mar"},
        {stack: "grey",  value: 80, date: "Apr"},
      
        {stack: "green",  value: 150, date: "May"},
        {stack: "green", value: 70, date: "Jun"},
      
        {stack: "grey",  value: 170, date: "May"},
        {stack: "grey",  value: 40, date: "Jun"},
      
        {stack: "green",  value: 150, date: "Jul"},
        {stack: "green", value: 190, date: "Aug"},
      
        {stack: "grey", value: 140, date: "Jul"},
        {stack: "grey",  value: 120, date: "Aug"},
      
        {stack: "green", value: 100, date: "Sep"},
        {stack: "green",  value: 60, date: "Oct"},
      
        {stack: "grey",  value: 100, date: "Sep"},
        {stack: "grey",  value: 70, date: "Oct"},
      
        {stack: "green",  value: 80, date: "Nov"},
        {stack: "green",  value: 120, date: "Dec"},
      
        {stack: "grey", value: 190, date: "Nov"},
        {stack: "grey",  value: 80, date: "Dec"},
      
  ]
};
function createGroupedBarChartPredictedHalf() {
      var groupedBarChart = britecharts.groupedBar(),
        chartTooltip = britecharts.tooltip(),
        container = d3.select('.js-grouped-bar-chart-tooltip-container-predicted-Half'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer;

    let color = ["#dfe2e6","#39bd3d "];
    
    groupedBarChart
      .width(containerWidth)
      .groupLabel('stack')
      .height(300)
      .nameLabel('date')
      .valueLabel('value')
      .isAnimated(true)
      .colorSchema(color)
      .grid('horizontal')

    
      .on('customMouseOver', function() {
      chartTooltip.show();
    })
      .on('customMouseMove', function(dataPoint, topicColorMap, x,y) {
      chartTooltip.update(dataPoint, topicColorMap, x, y);
    })
      .on('customMouseOut', function() {
      chartTooltip.hide();
    });
  
    container.datum(groupedBarDataPredictedHalf.data).call(groupedBarChart);
  
    chartTooltip
      .nameLabel('stack')
      .topicLabel('values')
      .dateLabel('key')
      .title('Title is Here')
    .shouldShowDateInTitle(false);

    tooltipContainer = d3.select('.js-grouped-bar-chart-tooltip-container-predicted-Half .metadata-group');
    tooltipContainer.datum([]).call(chartTooltip);
    
}
createGroupedBarChartPredictedHalf();


/**/
let groupedBarData = {
  data:[
/*    */{stack: "green", value: 88.1, date: "Jan"},
        {stack: "green", value: 100, date: "Feb"},
      
        {stack: "grey", value: 60, date: "Jan"},
        {stack: "grey", value: 80, date: "Feb"},
      
        {stack: "green",  value: 140, date: "Mar"},
        {stack: "green",  value: 120, date: "Apr"},
      
        {stack: "grey",  value: 150, date: "Mar"},
        {stack: "grey",  value: 80, date: "Apr"},
      
        {stack: "green",  value: 150, date: "May"},
        {stack: "green", value: 70, date: "Jun"},
      
        {stack: "grey",  value: 170, date: "May"},
        {stack: "grey",  value: 40, date: "Jun"},
      
        {stack: "green",  value: 150, date: "Jul"},
        {stack: "green", value: 190, date: "Aug"},
      
        {stack: "grey", value: 140, date: "Jul"},
        {stack: "grey",  value: 120, date: "Aug"},
      
        {stack: "green", value: 100, date: "Sep"},
        {stack: "green",  value: 60, date: "Oct"},
      
        {stack: "grey",  value: 100, date: "Sep"},
        {stack: "grey",  value: 70, date: "Oct"},
      
        {stack: "green",  value: 80, date: "Nov"},
        {stack: "green",  value: 120, date: "Dec"},
      
        {stack: "grey", value: 190, date: "Nov"},
        {stack: "grey",  value: 80, date: "Dec"},
      
  ]
};

function createGroupedBarChart() {
      var groupedBarChart = britecharts.groupedBar(),
        chartTooltip = britecharts.tooltip(),
        container = d3.select('.js-grouped-bar-chart-tooltip-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer;

    let color = ["#dfe2e6", "#39bd3d"];
    
    groupedBarChart

        .width(containerWidth)
        .groupLabel('stack')
        .nameLabel('date')
        .valueLabel('value')
        .height(300)
    
      .isAnimated(true)
      .colorSchema(color)
      .grid('horizontal')

    
      .on('customMouseOver', function() {
      chartTooltip.show();
    })
      .on('customMouseMove', function(dataPoint, topicColorMap, x,y) {
      chartTooltip.update(dataPoint, topicColorMap, x, y);
    })
      .on('customMouseOut', function() {
      chartTooltip.hide();
    });
  
    container.datum(groupedBarData.data).call(groupedBarChart);
  
    chartTooltip
      .nameLabel('stack')
      .topicLabel('values')
      .dateLabel('key')
      .title('Title is Here')
    .shouldShowDateInTitle(false);

    tooltipContainer = d3.select('.js-grouped-bar-chart-tooltip-container .metadata-group');
    tooltipContainer.datum([]).call(chartTooltip);
    
}
createGroupedBarChart();


    // example datasets

let groupedBarDataPredicted = {
  data:[
/*    */{stack: "green", value: 88.1, date: "Jan"},
        {stack: "green", value: 100, date: "Feb"},
      
        {stack: "grey", value: 60, date: "Jan"},
        {stack: "grey", value: 80, date: "Feb"},
      
        {stack: "green",  value: 140, date: "Mar"},
        {stack: "green",  value: 120, date: "Apr"},
      
        {stack: "grey",  value: 150, date: "Mar"},
        {stack: "grey",  value: 80, date: "Apr"},
      
        {stack: "green",  value: 150, date: "May"},
        {stack: "green", value: 70, date: "Jun"},
      
        {stack: "grey",  value: 170, date: "May"},
        {stack: "grey",  value: 40, date: "Jun"},
      
        {stack: "green",  value: 150, date: "Jul"},
        {stack: "green", value: 190, date: "Aug"},
      
        {stack: "grey", value: 140, date: "Jul"},
        {stack: "grey",  value: 120, date: "Aug"},
      
        {stack: "green", value: 100, date: "Sep"},
        {stack: "green",  value: 60, date: "Oct"},
      
        {stack: "grey",  value: 100, date: "Sep"},
        {stack: "grey",  value: 70, date: "Oct"},
      
        {stack: "green",  value: 80, date: "Nov"},
        {stack: "green",  value: 120, date: "Dec"},
      
        {stack: "grey", value: 190, date: "Nov"},
        {stack: "grey",  value: 80, date: "Dec"},
      
  ]
};
function createGroupedBarChartPredicted() {
      var groupedBarChart = britecharts.groupedBar(),
        chartTooltip = britecharts.tooltip(),
        container = d3.select('.js-grouped-bar-chart-tooltip-container-predicted'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer;

    let color = ["#dfe2e6", "#39bd3d"];
    
    groupedBarChart

/*
      .width(containerWidth)
*/
        .height(300)
        .groupLabel('stack')
        .nameLabel('date')
        .valueLabel('value')
    
      .isAnimated(true)
      .colorSchema(color)
      .grid('horizontal')

    
      .on('customMouseOver', function() {
      chartTooltip.show();
    })
      .on('customMouseMove', function(dataPoint, topicColorMap, x,y) {
      chartTooltip.update(dataPoint, topicColorMap, x, y);
    })
      .on('customMouseOut', function() {
      chartTooltip.hide();
    });
  
    container.datum(groupedBarDataPredicted.data).call(groupedBarChart);
  
    chartTooltip
      .nameLabel('stack')
      .topicLabel('values')
      .dateLabel('key')
      .title('Title is Here')
    .shouldShowDateInTitle(false);

    tooltipContainer = d3.select('.js-grouped-bar-chart-tooltip-container-predicted .metadata-group');
    tooltipContainer.datum([]).call(chartTooltip);
    
}
createGroupedBarChartPredicted();

/*
    let color = ["#7cdb79", "#5fd45f", "#39bd3d","#7cdb79", "#5fd45f", "#39bd3d" ];
*/


let donutData = {
  data:[
    {name: "Shiny", id: 1, quantity: 12213200, percentage: 10},
    {name: "Blazing", id: 2, quantity: 10213200, percentage: 20},
    {name: "Dazzling", id: 3, quantity: 1413200, percentage: 30},
    {name: "Q2", id: 4, quantity: 1123200, percentage: 20},
  ]
};

function createDonutChart() {
  let donutChart = britecharts.donut(),
  legendContainer;

  donutChart
    .width(300)
    .height(350)
      .isAnimated(true)
    .highlightSliceById(4)
    .hasFixedHighlightedSlice(true)
    .centeredTextFunction(d => `${d.name}  ${d.percentage}%  ${d.quantity} LE` )
    .numberFormat('sasd');

  
  d3.select('.js-donut-chart-container').datum(donutData.data).call(donutChart);
  legendContainer = d3.select();
  legendContainer.datum(donutData.data);

}

createDonutChart();

function createDonutChart2() {
  let donutChart = britecharts.donut(),
  legendContainer;

  donutChart
    .width(300)
    .height(350)
      .isAnimated(true)
    .highlightSliceById(4)
    .hasFixedHighlightedSlice(true)
    .centeredTextFunction(d => `${d.name}  ${d.percentage}%  ${d.quantity} LE` )
    .numberFormat('sasd');

  
  d3.select('.js-donut-chart-container2').datum(donutData.data).call(donutChart);
  legendContainer = d3.select();
  legendContainer.datum(donutData.data);

}

createDonutChart2();



let stackedAreaData = {
data: [
  {name: "Direct", views: 0, date: "2011-01-05T00:00:00"},
  {name: "Direct", views: 5, date: "2011-01-06T00:00:00"},
  {name: "Direct", views: 7, date: "2011-01-07T00:00:00"},
  {name: "Direct", views: 6, date: "2011-01-08T00:00:00"},
  {name: "Eventbrite", views: 3, date: "2011-01-05T00:00:00"},
  {name: "Eventbrite", views: 6, date: "2011-01-06T00:00:00"},
  {name: "Eventbrite", views: 4, date: "2011-01-07T00:00:00"},
  {name: "Eventbrite", views: 0, date: "2011-01-08T00:00:00"},
  {name: "Email", views: 5, date: "2011-01-05T00:00:00"},
  {name: "Email", views: 2, date: "2011-01-06T00:00:00"},
  {name: "Email", views: 3, date: "2011-01-07T00:00:00"},
  {name: "Email", views: 3, date: "2011-01-08T00:00:00"}
]};
function createStackedAreaChart() {
    let stackedAreaChart = britecharts.stackedArea(),
        chartTooltip = britecharts.tooltip(),
        dataSet = stackedAreaData.data,
        container = d3.select('.js-stacked-area-chart-tooltip-container'),
        containerWidth = container.node() ? container.node().getBoundingClientRect().width : false,
        tooltipContainer;

      stackedAreaChart
        .colorSchema(britecharts.colors.colorSchemas.green)
        .isAnimated(true)
        .tooltipThreshold(600)
        .width(containerWidth)
        .grid('horizontal')
        .keyLabel('name')
        .dateLabel('date')
        .valueLabel('views')
        .on('customMouseOver', chartTooltip.show)
        .on('customMouseMove', chartTooltip.update)
        .on('customMouseOut', chartTooltip.hide);

      container.datum(dataSet).call(stackedAreaChart);

      chartTooltip
        .topicLabel('values')
        .title('Testing tooltip')

      tooltipContainer = d3.select('.js-stacked-area-chart-tooltip-container .metadata-group .vertical-marker-container');
      tooltipContainer.datum(dataSet).call(chartTooltip);
}
createStackedAreaChart();

    