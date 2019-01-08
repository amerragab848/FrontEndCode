import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import addNoDataModule from 'highcharts/modules/no-data-to-display';
//import 'bootstrap/dist/css/bootstrap.css';
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
                    text: this.props.title
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
        }
    }
    componentDidMount(){
        let _series=[]
        Api.get(this.props.api).then(results => {
            results.map((obj)=>{
                _series.push({name:obj[this.props.name] , y:obj[this.props.y] });
                return null;
            })
            this.setState({options:{ series: { name:this.props.seriesName , data :_series} }});
         }).catch ((ex) => {
            console.log(ex);
         });

    }
    render() { 
        return ( 
                <div className="card">
                    <div className="card-body">
                        <HighchartsReact
                            highcharts={Highcharts}
                            options={this.state.options}
                        />
                    </div> 
                </div> 
        );
    }
}

export default PieChartComp;
