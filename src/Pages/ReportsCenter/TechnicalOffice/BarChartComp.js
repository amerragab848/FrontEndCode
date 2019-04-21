import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import addNoDataModule from 'highcharts/modules/no-data-to-display';
import exporting from 'highcharts/modules/exporting'
import language from '../../../resources.json'
import { func } from 'prop-types';
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
addNoDataModule(Highcharts);
exporting(Highcharts)
class BarChartComp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            noClicks: null,
            options:
            {
                lang: {
                    noData: language['noData'][currentLanguage],
                },
                noData: {
                    style: {
                        fontWeight: 'bold',
                        fontSize: '25px',
                        color: '#1B4EDB',
                    },
                },
                chart: {
                    type:this.props.type ? this.props.type : 'line',
                },
                title: {
                    text: this.props.title
                },
                xAxis: {
                 //   categories: [],
                    type: this.props.xAxisType?this.props.xAxisType:'',
               
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: this.props.yTitle
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                legend: {
                    align: 'right',
                    x: -30,
                    verticalAlign: 'top',
                    y: 25,
                    floating: true,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                    borderColor: '#CCC',
                    borderWidth: 1,
                    shadow: false
                },
                tooltip: {
                    headerFormat: '<b>{point.x}</b><br/>',
                    pointFormat: ' <span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b><br/>'
                },
                plotOptions: {
                    column: {
                        stacking: this.props.stack ? this.props.stack : '',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'black'
                        }
                    }
                },
                series: [{
                    name: '',
                    data: []
                }],
                credits: {
                    enabled: false

                },
                exporting: {
                    enabled: true
                }
            }
        }
    }

    componentWillReceiveProps(props) {
        if (props.noClicks != this.state.noClicks) {
            this.setState({ isLoading: true, noClicks: props.noClicks })
            let options = { ...this.state.options };
            options.series = props.series
            if(props.xAxisType==undefined)
            options.xAxis = props.xAxis
            this.setState({ options }, function () { this.setState({ isLoading: false }) });
        }
    }

    render() {
        let test = <HighchartsReact
            highcharts={Highcharts}
            options={this.state.options}
        />
        return (
            <div className="charts__row">
                <div className="panel barChart__container">
                    <div className="panel-body">
                        {this.state.isLoading == true ? null :
                            test
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default BarChartComp;
