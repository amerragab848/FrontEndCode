import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import addNoDataModule from 'highcharts/modules/no-data-to-display'; 
import Api from '../../api';
import language from '../../resources.json'
let currentLanguage = localStorage.getItem('lang')==null? 'en' : localStorage.getItem('lang');

addNoDataModule(Highcharts);

class PieChartComp extends Component {

    constructor(props) {
        super(props);

        this.state = {
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
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    type: 'pie'
                   
                },
                title: {
                    text:language[this.props.title][currentLanguage]
                },
              
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: false
                        },
                        showInLegend: true
                    }
                },
                series:[],
                credits: {
                    enabled: false

                }

            }
           , noClicks: null,
        }
    }

    componentWillReceiveProps(props) {
        if (props.noClicks != this.state.noClicks) {
            this.setState({ isLoading: true, noClicks: props.noClicks })
            let options = { ...this.state.options };
            options.series = props.series
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
                <div className="panel">
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

export default PieChartComp;
