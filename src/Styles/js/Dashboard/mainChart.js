/* eslint-disable no-console */
var c = document.getElementById("linebar-half");
var ctx = c.getContext("2d");
ctx.height = 200;
var gradientStroke = ctx.createLinearGradient(0, 500, 0, 100);
gradientStroke.addColorStop(0, '#80b6f4');
gradientStroke.addColorStop(1, '#f49080');


/*gradientFill.addColorStop(0, "rgba(219, 251, 220, 0.1)");
 */

var gradientFill = ctx.createRadialGradient(0, 0, 900, 0, 500, 0);

gradientFill.addColorStop(0, "rgba(219, 251, 220, 0.2)");
gradientFill.addColorStop(1, "rgba(219, 251, 220, 0.6)");


// Fill with gradient
ctx.fillStyle = gradientFill;
ctx.fillRect(10, 10, 150, 80);


var gradientFill2 = ctx.createLinearGradient(500, 0, 100, 0);
gradientFill2.addColorStop(0, "#bcf0b4");
gradientFill2.addColorStop(1, "#dbfbdc");


var Predicted = ctx.createLinearGradient(0, 0, 1200, 0, 900, 0);

Predicted.addColorStop(0, "rgba(238, 238, 238, 0.5)");
Predicted.addColorStop(1, "rgba(238, 238, 238, 0.3)");




new Chart(document.getElementById("linebar-half"), {
    type: 'line',
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "AUG", "SEP", "OCT", "NOV", "DES"],
        datasets: [
            {
                label: "2017",
                borderColor: "#5fd45f",
                pointBorderColor: "#5fd45f",
                pointBackgroundColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#5fd45f",
                pointBorderWidth: 4,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointHoverBorderWidth: 4,
                fill: true,
                backgroundColor: gradientFill,
                borderWidth: 4,
                data: [100, 120, 150, 170, 150, 170, 160, 120, 150, 170, 150, 170],

        },
            {
                label: "2016",
                borderColor: "#bcf0b4",
                pointBorderColor: "#bcf0b4",
                pointBackgroundColor: "#bcf0b4",
                pointHoverBackgroundColor: "#bcf0b4",
                pointHoverBorderColor: "#bcf0b4",
                pointBorderWidth: 0,
                pointHoverRadius: 0,
                pointHoverBorderWidth: 0,
                pointRadius: 0,
                fill: true,
                backgroundColor: "transparent",
                borderWidth: 0,
                data: [99, 100, 140, 180, 160, 150, 99, 190, 2, 33, 55, 66]
        }
                  ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            easing: "easeOutBack",
            duration: 1800,
        },
        legend: {
            display: false,
            position: "bottom"
        },
        tooltips: {
            mode: 'label',
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "#3e4352",
                    /*
                                        fontStyle: "bold",
                    */
                    beginAtZero: true,
                    maxTicksLimit: 4,
                    padding: 30,


                },
                gridLines: {
                    drawTicks: false,
                    display: true,
                    showLines: false,
                    borderDash: [10, 10],
                    color: "#ccc",
                },
            }],

            xAxes: [{
                gridLines: {
                    display: false,
                    zeroLineColor: "transparent"
                },
                ticks: {
                    padding: 5,
                    fontColor: "#3e4352",
                    fontFamily: "font-opens",
                    fontSize: 12
                    /*
                                        fontStyle: "bold",
                    */
                },
            }],

        }
    }
});

/*Half Predicted*/

new Chart(document.getElementById("linebar-predicted"), {
    type: 'line',
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "AUG", "SEP", "OCT", "NOV", "DES"],
        datasets: [
            {
                label: "2017",
                borderColor: "#5fd45f",
                pointBorderColor: "#5fd45f",
                pointBackgroundColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#5fd45f",
                pointBorderWidth: 4,
                pointHoverRadius: 10,
                pointHoverBorderWidth: 4,
                pointRadius: 8,
                fill: true,
                backgroundColor: gradientFill,
                borderWidth: 4,
                data: [100, 120, 150, 170, 150, 170, 150],

        },
            {
                label: "predicted",
                borderColor: "#ccd2db",
                pointBorderColor: "#ccd2db",
                pointBackgroundColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#ccd2db",
                pointBorderWidth: 4,
                pointHoverRadius: 10,
                pointHoverBorderWidth: 4,
                pointRadius: 8,
                fill: true,
                backgroundColor: "transparent",
                borderWidth: 4,
                data: [null, null, null, null, null, null, 150,
                       150, 160, 170, 180, 180]
        },
               {
                label: "2016",
                borderColor: "#bcf0b4",
                pointBorderColor: "#bcf0b4",
                pointBackgroundColor: "#bcf0b4",
                pointHoverBackgroundColor: "#bcf0b4",
                pointHoverBorderColor: "#bcf0b4",
                pointBorderWidth: 0,
                pointHoverRadius: 0,
                pointHoverBorderWidth: 0,
                pointRadius: 0,
                fill: true,
                backgroundColor: "transparent",
                borderWidth: 0,
                data: [99, 100, 140, 180, 160, 150, 99, 99, 100, 140, 180, 140, 150]
        },
                  ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            easing: "easeOutBack",
            duration: 1800,
        },
        legend: {
            display: false,
            position: "bottom"
        },
        tooltips: {
            mode: 'label',
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "#3e4352",
                    /*
                                        fontStyle: "bold",
                    */
                    beginAtZero: true,
                    maxTicksLimit: 4,
                    padding: 30,


                },
                gridLines: {
                    drawTicks: false,
                    display: true,
                    showLines: false,
                    borderDash: [10, 10],
                    color: "#ccc",
                },
            }],

            xAxes: [{
                gridLines: {
                    display: false,
                    zeroLineColor: "transparent"
                },
                ticks: {
                    padding: 5,
                    fontColor: "#3e4352",
                    fontFamily: "font-opens",
                    fontSize: 12
                    /*
                                        fontStyle: "bold",
                    */
                },
            }],

        }
    }
});



/**/

new Chart(document.getElementById("linebar-70"), {
    type: 'line',
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "AUG", "SEP", "OCT", "NOV", "DES"],
        datasets: [
            {
                label: "2017",
                borderColor: "#5fd45f",
                pointBorderColor: "#5fd45f",
                pointBackgroundColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#5fd45f",
                pointBorderWidth: 4,
                pointHoverRadius: 10,
                pointHoverBorderWidth: 4,
                pointRadius: 8,
                fill: true,
                backgroundColor: gradientFill,
                borderWidth: 4,
                data: [100, 120, 150, 170, 150, 170, 160, 120, 150, 170, 150, 170, ],

        },
            {
                label: "2016",
                borderColor: "#bcf0b4",
                pointBorderColor: "#bcf0b4",
                pointBackgroundColor: "#bcf0b4",
                pointHoverBackgroundColor: "#bcf0b4",
                pointHoverBorderColor: "#bcf0b4",
                pointBorderWidth: 0,
                pointHoverRadius: 0,
                pointHoverBorderWidth: 0,
                pointRadius: 0,
                fill: true,
                backgroundColor: "transparent",
                borderWidth: 0,
                data: [99, 100, 140, 180, 160, 150, 99, 190, 2, 33, 55, 66, ]
        }
                  ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            easing: "easeOutBack",
            duration: 1800,
        },
        legend: {
            display: false,
            position: "bottom"
        },
        tooltips: {
            mode: 'label',
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "#3e4352",
                    beginAtZero: true,
                    maxTicksLimit: 4,
                    padding: 30,


                },
                gridLines: {
                    drawTicks: false,
                    display: true,
                    showLines: false,
                    borderDash: [10, 10],
                    color: "#ccc",
                },
            }],

            xAxes: [{
                gridLines: {
                    display: false,
                    zeroLineColor: "transparent"
                },
                ticks: {
                    padding: 5,
                    fontColor: "#3e4352",
                    fontFamily: "font-opens",
                    fontSize: 12
                    /*
                                        fontStyle: "bold",
                    */
                },
            }],

        }
    }
});


//Line bar pre
new Chart(document.getElementById("linebar-70-predicted"), {
    type: 'line',
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "AUG", "SEP", "OCT", "NOV", "DES"],
        datasets: [
            {
                label: "2017",
                borderColor: "#5fd45f",
                pointBorderColor: "#5fd45f",
                pointBackgroundColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#5fd45f",
                pointBorderWidth: 4,
                pointHoverRadius: 10,
                pointHoverBorderWidth: 4,
                pointRadius: 8,
                fill: true,
                backgroundColor: gradientFill,
                borderWidth: 4,
                data: [100, 120, 150, 170, 150, 170, 150],

        },
            {
                label: "2016",
                borderColor: "#bcf0b4",
                pointBorderColor: "#bcf0b4",
                pointBackgroundColor: "#bcf0b4",
                pointHoverBackgroundColor: "#bcf0b4",
                pointHoverBorderColor: "#bcf0b4",
                pointBorderWidth: 0,
                pointHoverRadius: 0,
                pointHoverBorderWidth: 0,
                pointRadius: 0,
                fill: true,
                backgroundColor: "transparent",
                borderWidth: 0,
                data: [99, 100, 140, 180, 160, 150, 99, ]
        },
            {
                label: "predicted",
                borderColor: "#ccd2db",
                pointBorderColor: "#ccd2db",
                pointBackgroundColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#ccd2db",
                pointBorderWidth: 4,
                pointHoverRadius: 10,
                pointHoverBorderWidth: 4,
                pointRadius: 8,
                fill: true,
                backgroundColor: "transparent",
                borderWidth: 4,
                data: [null, null, null, null, null, null, 150, 150, 160, 170, 180, 180]
        },
            {
                label: "predicted",
                borderColor: "#bcf0b4",
                pointBorderColor: "#bcf0b4",
                pointBackgroundColor: "#bcf0b4",
                pointHoverBackgroundColor: "#bcf0b4",
                pointHoverBorderColor: "#bcf0b4",
                pointBorderWidth: 0,
                pointHoverRadius: 0,
                pointHoverBorderWidth: 0,
                pointRadius: 0,
                fill: true,
                backgroundColor: "transparent",
                borderWidth: 0,
                data: [null, null, null, null, null, null, 99, 100, 140, 180, 140, 150]
        },
                  ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            easing: "easeOutBack",
            duration: 1800,
        },
        legend: {
            display: false,
            position: "bottom"
        },
        tooltips: {
            mode: 'label',
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "#3e4352",
                    /*
                                        fontStyle: "bold",
                    */
                    beginAtZero: true,
                    maxTicksLimit: 4,
                    padding: 30,


                },
                gridLines: {
                    drawTicks: false,
                    display: true,
                    showLines: false,
                    borderDash: [10, 10],
                    color: "#ccc",
                },
            }],

            xAxes: [{
                gridLines: {
                    display: false,
                    zeroLineColor: "transparent"
                },
                ticks: {
                    padding: 5,
                    fontColor: "#3e4352",
                    fontFamily: "font-opens",
                    fontSize: 12
                    /*
                                        fontStyle: "bold",
                    */
                },
            }],

        }
    }
});




/*full*/


new Chart(document.getElementById("linebar-full"), {
    type: 'line',
    data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "AUG", "SEP", "OCT", "NOV", "DES"],
        datasets: [
            {
                label: "2017",
                borderColor: "#5fd45f",
                pointBorderColor: "#5fd45f",
                pointBackgroundColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#5fd45f",
                pointBorderWidth: 4,
                pointHoverRadius: 10,
                pointHoverBorderWidth: 4,
                pointRadius: 8,
                fill: true,
                backgroundColor: gradientFill,
                borderWidth: 4,
                data: [100, 120, 150, 170, 150, 170, 160, 120, 150, 170, 150, 170, ],

        },
            {
                label: "2016",
                borderColor: "#bcf0b4",
                pointBorderColor: "#bcf0b4",
                pointBackgroundColor: "#bcf0b4",
                pointHoverBackgroundColor: "#bcf0b4",
                pointHoverBorderColor: "#bcf0b4",
                pointBorderWidth: 0,
                pointHoverRadius: 0,
                pointHoverBorderWidth: 0,
                pointRadius: 0,
                fill: true,
                backgroundColor: "transparent",
                borderWidth: 0,
                data: [99, 100, 140, 180, 160, 150, 99, 190, 2, 33, 55, 66, ]
        }
                  ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            easing: "easeOutBack",
            duration: 1800,
        },
        legend: {
            display: false,
            position: "bottom"
        },
        tooltips: {
            mode: 'label',
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: "#3e4352",
                    beginAtZero: true,
                    maxTicksLimit: 4,
                    padding: 30,


                },
                gridLines: {
                    drawTicks: false,
                    display: true,
                    showLines: false,
                    borderDash: [10, 10],
                    color: "#ccc",
                },
            }],

            xAxes: [{
                gridLines: {
                    display: false,
                    zeroLineColor: "transparent"
                },
                ticks: {
                    padding: 5,
                    fontColor: "#3e4352",
                    fontFamily: "font-opens",
                    fontSize: 12
                    /*
                                        fontStyle: "bold",
                    */
                },
            }],

        }

    }
});

/*Start BritCharts JS */

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

    

/*SparkLines jquery */

   $(".sparkline").sparkline([95, 100, 92, 92, 95,95,98,100,90,98,100,90], 
          {
            type: 'bar',
            height: 36,
            barWidth: 15,
            barColor: '#7cdb79',
            barSpacing: 0,
            disableTooltips: false,
            highlightLighten: 0.7
        }
   );