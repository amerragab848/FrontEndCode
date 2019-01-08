import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import addNoDataModule from 'highcharts/modules/no-data-to-display';
import exporting from 'highcharts/modules/exporting'
//import 'bootstrap/dist/css/bootstrap.css';
import Api from '../../api';
import language from '../../resources.json'
let currentLanguage = localStorage.getItem('lang');

addNoDataModule(Highcharts);
exporting(Highcharts)
class BarChartComp extends Component {

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
                    type: 'column'
                },
                title: {
                    text: this.props.title
                },
                xAxis: {
                    categories: []
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
                        stacking: this.props.stack,
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
                exporting:{
                    enabled:true
                }


            }
        }  
    }

    componentDidMount = () => {

        let _catag = []
        let _data = []
        Api.get(this.props.api).then(results => {

            if (this.props.multiSeries === 'no') {
                results.map((item) => {
                    _data.push(item[this.props.y])
                    _catag.push(item[this.props.catagName]);
                    return null;
                });

                this.setState({ options: { series: { name: this.props.title, data: _data }, xAxis: { categories: _catag } } });
            }
            else {
                results.map((item) => {
                    _catag.push(item[this.props.catagName]);
                    return null;
                })
                let _series = []
                this.props.barContent.map((bar) => {

                    let content = []
                    results.map((obj) => {
                        content.push(obj[bar.value]);
                        return null;
                    })
                    _series.push({ name: bar.name, data: content });
                    return null;
                })
                this.setState({ options: { series: _series, xAxis: { categories: _catag } } });
            }

        }).catch((ex) => {
            console.log(ex);
        });
    }

    render() { 
        return ( 
            <div className="panel p-0">
                <div className="panel-body">
                    <HighchartsReact 
                        highcharts={Highcharts}
                        options={this.state.options}
                    />
                </div> 
            </div> 
        );
    }
}

export default BarChartComp;
