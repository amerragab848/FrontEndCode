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

class SubmittalsPerNeighBorhood extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: null,
            finishDate: moment(),
            startDate: moment(),
            noClicks: 0, xAxis: {}, series: [], showChart: false
        }

        if (!Config.IsAllow(3761)) {
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
        Api.post('GetEpsCountFromSubmittals', reportobj).then(res => {
            this.setState({ isLoading: false })
            let _catag = []
            let _data = []
            res.map((item, index) => {
                _catag.push(item.title);
                _data.push(item.count)
            })
            let series = []
            series.push({ name: Resources['count'][currentLanguage], data: _data })
            let xAxis = { categories: _catag }
            this.setState({ series, xAxis, noClicks: noClicks + 1, showChart: true });
        })

    }
    handleChange = (name, value) => {
        this.setState({ [name]: value })
    }

    render() {
        const Chart =
            <BarChartComp
                noClicks={this.state.noClicks}
                series={this.state.series}
                xAxis={this.state.xAxis}
                title={Resources['submittalsPerNeighBorhood'][currentLanguage]} yTitle={Resources['count'][currentLanguage]} />

        return (

            <div className="reports__content">
                <header>
                    <h2 className="zero">{Resources.submittalsPerNeighBorhood[currentLanguage]}</h2>

                </header>
                {this.state.isLoading == true ? <LoadingSection /> :
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
                    </div>}
                {this.state.showChart == true ?
                    <div className="doc-pre-cycle letterFullWidth">
                        {Chart}
                    </div> : null}
            </div>

        )
    }

}


export default SubmittalsPerNeighBorhood
