import React, { Component } from 'react'
import Api from '../../../api';
import Resources from '../../../resources.json';
import { toast } from "react-toastify";
import Config from '../../../Services/Config';
import DatePicker from '../../../Componants/OptionsPanels/DatePicker'
import moment from "moment";
import BarChartComp from './BarChartComp'
import LoadingSection from '../../../Componants/publicComponants/LoadingSection';
const _ = require('lodash')
let currentLanguage = localStorage.getItem('lang') == null ? 'en' : localStorage.getItem('lang');
class ContractorsPerformance extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            finishDate: moment(),
            startDate: moment(),
            reportData: [],
            noClicks: 0,
            showChart: false
        }

        if (!Config.IsAllow(3764)) {
            toast.success(Resources["missingPermissions"][currentLanguage]);
            this.props.history.push({
                pathname: "/"
            });
        }

    }


    getChartData = () => {
        let reportobj = {
            fromDate: moment(this.state.startDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
            toDate: moment(this.state.finishDate, 'DD/MM/YYYY').format('YYYY-MM-DD[T]HH:mm:ss.SSS'),
        }
        let noClicks = this.state.noClicks;

        this.setState({ isLoading: true })
        Api.post('GetContractorsPerformance', reportobj).then(res => {
            this.setState({ isLoading: false ,showChart:true})
            if (res.length > 0) {
                let _catag = []
                let series = []
                res[0].listCounts.map((item, index) => {
                    _catag.push(item.companyName);

                })
                 let listCount = []
                // res.map((item, index) => {
                //     listCount = []
                //     item.listCounts.map((element, index) => {
                //         listCount.push(element.count)
                //     })
                //     series.push({ name: item.epsName, value: listCount })
                // })

                res.map((item) => {
                    item.listCounts.map((obj) => {
                        listCount.push({ stack: item.epsName, value: obj["count"], name: obj["companyName"] })
                        return null;
                    })
          
                    return null;
                });

                let xAxis = { categories: _catag }
                this.setState({ series:listCount, noClicks: noClicks + 1, showChart: true });
            }
        })
    }
    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {
        const Chart = this.state.showChart ?
            (<BarChartComp
                stack={'normal'}
                noClicks={this.state.noClicks}
                type={'column'}
                isStack={true}
                multiSeries="no"
                series={this.state.series}
                xAxis={this.state.xAxis}
                title={Resources['contractorsPerformance'][currentLanguage]} yTitle={Resources['count'][currentLanguage]} />):null

        return (
            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.contractorsPerformance[currentLanguage]}</h2>
                </header>
                {this.state.isLoading == true ? <LoadingSection /> :
                    <React.Fragment>
                        <div className="proForm reports__proForm">
                            <div className="linebylineInput valid-input alternativeDate">
                                <DatePicker title='startDate'
                                    startDate={this.state.startDate}
                                    handleChange={e => this.handleChange('startDate', e)} />
                            </div>
                            <div className="linebylineInput valid-input alternativeDate">
                                <DatePicker title='finishDate'
                                    startDate={this.state.finishDate}
                                    handleChange={e => this.handleChange('finishDate', e)} />
                            </div>

                            <button className="primaryBtn-1 btn smallBtn" onClick={() => this.getChartData()}>{Resources['search'][currentLanguage]}</button>
                        </div>
                        {this.state.showChart == true ?
                            <div className="doc-pre-cycle letterFullWidth">
                                {Chart}
                            </div> : null}
                    </React.Fragment>}
            </div>

        )
    }

}


export default ContractorsPerformance
